import { Responder } from "../../../src/lib/responder";
import { Storage } from "../../../src/lib/storage";
import { Container } from "../../../src/types";
import { initializeStorageMock } from "./mockStorage";

export let storage: Storage;
export let responder: Responder;
export let container: Container;
export let responderSpy: jest.SpyInstance;

export const actionSetup = () => {
  responder = new Responder();
  responderSpy = jest.spyOn(responder, "output").mockImplementation(() => {});
  storage = initializeStorageMock();
  container = { storage, responder };
};

export const actionTearDown = () => {
  jest.clearAllMocks();
};
