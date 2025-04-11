import UserDirectoryFactory from "@/domain/application/interfaces/UserDirectoryFactory";
import NodeManager from "@/domain/core/interfaces/NodeManager";
import Repository from "@/domain/core/interfaces/Repository";
import Cryptography from "@/domain/interfaces/Cryptography";

export const repoMock: jest.Mocked<Repository> = {
  save: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const encryptMock: jest.Mocked<Cryptography> = {
  encrypt: jest.fn(),
  compare: jest.fn(),
};

export const userDirFactory: jest.Mocked<UserDirectoryFactory> = {
  createFor: jest.fn(),
  removeFor: jest.fn(),
};

export const nodeManager: jest.Mocked<NodeManager> = {
  createNode: jest.fn(),
  renameNode: jest.fn(),
  copyNode: jest.fn(),
  moveNode: jest.fn(),
  deleteNode: jest.fn(),
};
