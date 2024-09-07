import fs from "fs";
import { Storage } from "../../../src/lib/storage";
import { Task } from "../../../src/types";

describe(`storage test`, () => {
  const storageFileName = "test-storage";
  let storage: Storage;
  beforeAll(() => {});
  beforeEach(() => {
    storage = new Storage(storageFileName);
  });
  afterEach(() => {
    try {
      fs.unlinkSync(storageFileName);
    } catch (err) {
      console.log(`Storage file not found: ${(err as Error).message}`);
    }
  });
  it(`save task`, () => {
    const initalId = storage.getLastId();
    const task: Partial<Task> = {
      description: "something",
    };
    const saved = storage.add(task);

    expect(saved.id).toEqual(initalId + 1);
    expect(saved.description).toEqual(task.description);
    expect(saved.status).toEqual("todo");

    storage.reload();
    const loaded = storage.get(saved.id);
    expect(saved).toEqual(loaded);

    const saved2 = storage.add({
      description: "second task",
      status: "in-progress",
    });
    storage.reload();

    const loaded2 = storage.get(saved2.id);
    expect(saved2).toEqual(loaded2);
    expect(storage.getAll().length).toBe(2);
  });
  it(`delete task`, () => {
    const task: Partial<Task> = {
      description: "something",
    };
    const saved = storage.add(task);
    storage.reload();

    const result = storage.delete(saved.id);
    expect(result).toEqual(true);
    storage.reload();

    const result2 = storage.delete(saved.id);
    expect(result2).toEqual(false);
  });
  it(`update task`, async () => {
    const task: Partial<Task> = {
      description: "something",
      status: "todo",
    };
    const saved = storage.add(task);
    storage.reload();

    const loadedTask = storage.get(saved.id) as Task;
    const newDescription = "new something";
    const newStatus = "in-progress";
    loadedTask.description = newDescription;
    loadedTask.status = newStatus;
    await new Promise((resolve) => setTimeout(resolve, 10));
    const result = storage.update(loadedTask);
    expect(result).toEqual(true);
    storage.reload();

    const updated = storage.get(loadedTask.id) as Task;
    expect(updated.description).toEqual(newDescription);
    expect(updated.status).toEqual(newStatus);
    expect(updated.createdAt).toEqual(saved.createdAt);
    expect(updated.updatedAt).not.toEqual(saved.updatedAt);

    const fail = storage.update({ id: 999, description: "text" } as Task);
    expect(fail).toEqual(false);
  });
  it(`id increment`, () => {
    const task1 = {};
    const task2 = {};
    const task3 = {};
    const stored1 = storage.add(task1);
    const stored2 = storage.add(task3);
    storage.delete(stored2.id);
    const stored3 = storage.add(task2);
    expect(stored3.id).toEqual(3);
  });
  it(`get tasks with params`, () => {
    const task1 = { status: "in-progress" };
    const task2 = { status: "in-progress" };
    const task3 = { status: "done" };
    storage.add(task1 as Task);
    storage.add(task3 as Task);
    storage.add(task2 as Task);
    storage.reload();

    const ip = storage.getAll("in-progress");
    expect(ip.length).toEqual(2);
    const done = storage.getAll("done");
    expect(done.length).toEqual(1);
    const todo = storage.getAll("todo");
    expect(todo.length).toEqual(0);
  });
  it(`get all tasks`, () => {
    const task1 = { status: "in-progress" };
    const task2 = { status: "in-progress" };
    const task3 = { status: "done" };
    storage.add(task1 as Task);
    storage.add(task3 as Task);
    storage.add(task2 as Task);
    storage.reload();

    const ip = storage.getAll();
    expect(ip.length).toEqual(3);
  });
});
