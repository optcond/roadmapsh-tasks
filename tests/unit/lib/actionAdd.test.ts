import { Task } from "../../../src/types";
import { actionAdd } from "../../../src/lib/actions";
import { actionSetup, actionTearDown } from "./actionSetup";
import { container, responderSpy, storage } from "./actionSetup";

describe(`testing actions`, () => {
  beforeEach(() => {
    actionSetup();
  });
  afterEach(() => {
    actionTearDown();
  });
  it(`Add action: empty message`, () => {
    actionAdd(container, " ");
    expect(responderSpy).toHaveBeenCalledWith(["Empty text supplied"]);
  });
  it(`Add action: correct result`, () => {
    const addSpy = jest.spyOn(storage, "add");
    addSpy.mockReturnValue({
      id: 1,
    } as Task);
    actionAdd(container, "some text");

    expect(addSpy).toHaveBeenCalledWith({ description: "some text" });
    expect(responderSpy).toHaveBeenCalledWith([
      "Task added successfully (ID: 1)",
    ]);
  });
  it(`Add action: error result`, () => {
    const addSpy = jest.spyOn(storage, "add");

    addSpy.mockImplementation(() => {
      throw new Error(`Test error`);
    });

    actionAdd(container, "fail me");
    expect(responderSpy).toHaveBeenCalledWith([
      `Database interaction failed: Test error`,
    ]);
  });
});
