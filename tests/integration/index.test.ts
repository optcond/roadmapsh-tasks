import { Responder } from "../../src/lib/responder";
import { router } from "../../src/lib/router";
import { Storage } from "../../src/lib/storage";
import { Container } from "../../src/types";
import fs from "fs";

const storageFileName = "test-integration";

describe(`Integration tests`, () => {
  let storage: Storage;
  let responder: Responder;
  let container: Container;
  let responderSpy: jest.SpyInstance;
  beforeEach(() => {
    storage = new Storage(storageFileName);
    responder = new Responder();
    // responderSpy = jest.spyOn(responder, "output").mockImplementation();
    responderSpy = jest.spyOn(responder, "output");
    container = {
      storage,
      responder,
    };
  });
  afterEach(() => {
    try {
      fs.unlinkSync(storageFileName);
    } catch (err) {
      console.log(`Storage file not found: ${(err as Error).message}`);
    }
    jest.clearAllMocks();
  });
  it(`Task creation and output`, () => {
    router(container, "add", ["Buy groceries"]);

    const tasks = storage.getAll();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].description).toEqual("Buy groceries");
  });
  it(`Task update`, () => {
    router(container, "add", ["Buy groceries"]);
    const task = storage.getAll()[0];

    router(container, "update", [task.id.toString(), "Buy fresh groceries"]);
    const updatedTask = storage.get(task.id);

    expect(updatedTask?.description).toEqual("Buy fresh groceries");
  });
  it(`Task delete`, () => {
    router(container, "add", ["Buy groceries"]);
    const task = storage.getAll()[0];

    router(container, "delete", [task.id.toString()]);
    const updatedTask = storage.get(task.id);

    expect(updatedTask).toEqual(null);
  });
  it(`Task mark`, () => {
    const storageSpy = jest.spyOn(storage, "update");

    router(container, "add", ["Buy groceries"]);
    const task = storage.getAll()[0];

    router(container, "mark-in-progress", [task.id.toString()]);

    expect(storageSpy).toHaveBeenCalledWith({
      ...task,
      status: "in-progress",
    });

    const updatedTask = storage.get(task.id);

    expect(updatedTask?.status).toEqual("in-progress");

    router(container, "mark-done", [task.id.toString()]);
    const updatedAgainTask = storage.get(task.id);

    expect(updatedAgainTask?.status).toEqual("done");
  });
  it(`Task list`, () => {
    router(container, "add", ["Buy groceries"]);
    router(container, "add", ["Store groceries"]);
    router(container, "add", ["Sell groceries"]);

    const tasks = storage.getAll();
    expect(tasks.length).toEqual(3);

    router(container, "mark-in-progress", [tasks[0].id.toString()]);
    router(container, "mark-in-progress", [tasks[2].id.toString()]);

    const ip = storage.getAll("in-progress");
    expect(ip.length).toEqual(2);

    const todo = storage.getAll("todo");
    expect(todo.length).toEqual(1);
  });
});
