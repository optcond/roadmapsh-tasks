import { actionDelete } from "../../../src/lib/actions";
import { actionSetup, actionTearDown } from "./actionSetup";
import { container, responderSpy, storage } from "./actionSetup";

describe(`testing actions`, () => {
  beforeEach(() => {
    actionSetup();
  });
  afterEach(() => {
    actionTearDown();
  });
  it(`Delete action: successful`, () => {
    const deleteSpy = jest.spyOn(storage, "delete");
    deleteSpy.mockReturnValue(true);

    actionDelete(container, "1");

    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(responderSpy).toHaveBeenCalledWith([`Task 1 deleted`]);
  });
  it(`Delete action: id not found / save failed`, () => {
    const deleteSpy = jest.spyOn(storage, "delete");
    deleteSpy.mockReturnValue(false);

    actionDelete(container, "1");

    expect(responderSpy).toHaveBeenCalledWith([`Task 1 doesn't exist`]);
  });
  it(`Update action: correct input`, () => {
    actionDelete(container, "fjsad");
    expect(responderSpy).toHaveBeenCalledWith([`Supplied ID is not a number`]);
  });
});
