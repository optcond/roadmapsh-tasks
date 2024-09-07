import { Task } from "../../../src/types";
import { actionUpdate, actionMark } from "../../../src/lib/actions";
import { actionSetup, actionTearDown } from "./actionSetup";
import { container, responderSpy, storage } from "./actionSetup";

describe(`testing actions`, () => {
  beforeEach(() => {
    actionSetup();
  });
  afterEach(() => {
    actionTearDown();
  });
  it(`Update action: successful`, () => {
    const getSpy = jest.spyOn(storage, "get");
    const updateSpy = jest.spyOn(storage, "update");
    getSpy.mockReturnValue({ id: 1, description: "old text" } as Task);
    updateSpy.mockReturnValue(true);

    actionUpdate(container, "1", "new text");

    expect(getSpy).toHaveBeenCalledWith(1);
    expect(updateSpy).toHaveBeenCalledWith({ id: 1, description: "new text" });
    expect(responderSpy).toHaveBeenCalledWith([`Task 1 updated`]);
  });
  it(`Update action: id not found`, () => {
    const getSpy = jest.spyOn(storage, "get");
    const updateSpy = jest.spyOn(storage, "update");
    getSpy.mockReturnValue(null);

    actionUpdate(container, "1", "new text");

    expect(responderSpy).toHaveBeenCalledWith([`Task with id 1 not exists`]);
    expect(updateSpy).not.toHaveBeenCalled();
  });
  it(`Update action: correct input`, () => {
    actionUpdate(container, "fjsad", "new text");
    expect(responderSpy).toHaveBeenCalledWith([`Supplied ID is not a number`]);

    actionUpdate(container, "1", undefined!);
    expect(responderSpy).toHaveBeenCalledWith([`Supplied text is empty`]);
  });
  it(`Update action: failed update`, () => {
    const updateSpy = jest.spyOn(storage, "update");
    (storage.get as jest.Mock).mockImplementationOnce(() => ({
      id: 1,
      description: "text",
    }));
    (storage.update as jest.Mock).mockImplementationOnce(() => false);

    actionUpdate(container, "1", "new text");

    expect(updateSpy).toHaveBeenCalledWith({
      id: 1,
      description: "new text",
    });
    expect(responderSpy).toHaveBeenCalledWith([`Failed to save task 1`]);
  });
  it(`Mark action: success`, () => {
    const getSpy = jest.spyOn(storage, "get");
    const updateSpy = jest.spyOn(storage, "update");
    getSpy.mockReturnValue({ id: 1, status: "todo" } as Task);
    updateSpy.mockReturnValue(true);

    actionMark(container, "1", "in-progress");

    expect(getSpy).toHaveBeenCalledWith(1);
    expect(updateSpy).toHaveBeenCalledWith({ id: 1, status: "in-progress" });
    expect(responderSpy).toHaveBeenCalledWith([`Task 1 updated`]);
  });
  it(`Mark action: wrong status`, () => {
    const getSpy = jest.spyOn(storage, "get");
    const updateSpy = jest.spyOn(storage, "update");
    getSpy.mockReturnValue({ id: 1, status: "in-progress" } as Task);

    actionMark(container, "1", "abracadabra" as any);

    expect(responderSpy).toHaveBeenCalledWith([`Wrong status value`]);
  });
  it(`Mark action: failed update`, () => {
    const updateSpy = jest.spyOn(storage, "update");
    (storage.get as jest.Mock).mockImplementationOnce(() => ({
      id: 1,
      status: "in-progress",
    }));
    (storage.update as jest.Mock).mockImplementationOnce(() => false);

    actionMark(container, "1", "done");

    expect(updateSpy).toHaveBeenCalledWith({
      id: 1,
      status: "done",
    });
    expect(responderSpy).toHaveBeenCalledWith([`Failed to save task 1`]);
  });
});
