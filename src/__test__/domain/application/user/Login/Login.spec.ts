/*
  parâmetros: classe de acesso a banco de dados Repository e uma instancia da classe Cryptography   ✔
  deve ter um método assícrono execute:    ✔
    execute deve ter como parâmetro um InputBoundary e como saída uma mensagem de sucesso   ✔
    deve validar a senha informada com a do banco de dados; 
    deve validar o username informada com o do banco de dados; 
*/

import { UserType } from "@/@types/types";
import { encryptMock, repoMock } from "@/__test__/__mocks__/interfacesMocks";
import {
  userCOMMON_Id,
  userCOMMON_Output,
} from "@/__test__/__mocks__/userMocks";
import InputBoundary from "@/domain/application/interfaces/InputBoundary";
import Login from "@/domain/application/user/Login/Login";
import User from "@/domain/core/User";
import DataMismatchError from "@/domain/errors/DataMismatchError";
import EntityNotFoundError from "@/domain/errors/EntityNotFoundError";

describe("Login", () => {
  describe("Constructor", () => {
    it("Deve instanciar um objeto da classe Login.", () => {
      expect(new Login(repoMock, encryptMock)).toBeInstanceOf(Login);
    });
  });

  describe("execute", () => {
    let login: Login;
    let inputBoundary: jest.Mocked<InputBoundary<Partial<UserType>>>;
    let dbUser: User;

    beforeEach(() => {
      login = new Login(repoMock, encryptMock);
      inputBoundary = {
        get: jest.fn(() => ({ username: "john-doe", password: "abc@ABC@123" })),
      };
      dbUser = new User(userCOMMON_Id);
      dbUser.setIsHashed();
    });

    afterEach(() => jest.clearAllMocks());

    it("Deve efetuar o login corretamente", async () => {
      repoMock.getOne.mockResolvedValue(dbUser);
      encryptMock.compare.mockResolvedValue(true);

      await expect(login.execute(inputBoundary)).resolves.toEqual([
        userCOMMON_Output,
      ]);
      expect(repoMock.getOne).toHaveBeenCalledWith({
        username: "john-doe",
      });
      expect(encryptMock.compare).toHaveBeenCalled();
    });

    it("Deve lançar uma exceção DataMismatchError quando a senha for incorreta", async () => {
      repoMock.getOne.mockResolvedValue(dbUser);
      encryptMock.compare.mockResolvedValue(false);

      await expect(() => login.execute(inputBoundary)).rejects.toThrow(
        DataMismatchError,
      );
      expect(encryptMock.compare).toHaveBeenCalled();
    });

    it("Deve lançar uma exceção EntityNotFound", async () => {
      repoMock.getOne.mockResolvedValue(null);
      await expect(() => login.execute(inputBoundary)).rejects.toThrow(
        EntityNotFoundError,
      );
    });
  });
});
