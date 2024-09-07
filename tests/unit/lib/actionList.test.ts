import { Task } from "../../../src/types";
import { actionList } from "../../../src/lib/actions";
import { actionSetup, actionTearDown } from "./actionSetup";
import { container, responderSpy, storage } from "./actionSetup";

describe(`testing actions`, () => {
  beforeEach(() => {
    actionSetup();
  });
  afterEach(() => {
    actionTearDown();
  });
  it(`List action: wrong status`, () => {
    actionList(container, "abracadabra" as any);
    expect(responderSpy).toHaveBeenCalledWith([`Wrong status value`]);
  });
  it(`List action: get all empty`, () => {
    (storage.getAll as jest.Mock).mockReturnValueOnce([]);
    actionList(container);
    expect(responderSpy).toHaveBeenCalledWith([`No tasks`]);
  });
  it(`List action: get by status`, () => {
    (storage.getAll as jest.Mock).mockReturnValueOnce([
      {
        id: 1,
        status: "done",
        description: "something 1",
        createdAt: "123",
        updatedAt: "321",
      } as Task,
      {
        id: 5,
        status: "done",
        description: "something 2",
        createdAt: "123",
        updatedAt: "321",
      } as Task,
    ]);
    actionList(container, "done");
    expect(responderSpy).toHaveBeenCalledWith([
      `id\tstatus\tcreated\tupdated\tdescription`,
      `1\tdone\t123\t321\tsomething 1`,
      `5\tdone\t123\t321\tsomething 2`,
    ]);
  });
});
