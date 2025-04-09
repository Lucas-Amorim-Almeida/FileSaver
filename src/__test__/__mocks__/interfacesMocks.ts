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
