import { Storage } from "../../../src/lib/storage";

jest.mock("../../../src/lib/storage", () => {
  return {
    Storage: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
      update: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
    })),
  };
});

export const initializeStorageMock = () => {
  return new Storage("mock-file");
};
