/*
  parâmetros: classe de acesso a banco de dados Repository e uma instancia da classe Cryptography   ✔
  deve ter um método assícrono execute:    ✔
    execute deve ter como parâmetro um InputBoundary e como saída uma mensagem de sucesso   ✔
    deve validar a senha informada com a do banco de dados; 
    deve validar o username informada com o do banco de dados; 
*/

import { UserType } from "@/@types/types";
import { repoMock } from "@/__test__/__mocks__/interfacesMocks";
import { userCOMMON_Id } from "@/__test__/__mocks__/userMocks";
import InputBoundary from "@/domain/application/interfaces/InputBoundary";
import RemoveUser from "@/domain/application/user/RemoveUser/RemoveUser";
import User from "@/domain/core/User";
import EntityNotFoundError from "@/domain/errors/EntityNotFoundError";

describe("RemoveUser", () => {
  describe("Constructor", () => {
    it("Deve instanciar um objeto da classe RemoveUser.", () => {
      expect(new RemoveUser(repoMock)).toBeInstanceOf(RemoveUser);
    });
  });

  describe("execute", () => {
    let remove: RemoveUser;
    let inputBoundary: jest.Mocked<InputBoundary<Partial<UserType>>>;
    let dbUser: User;

    beforeEach(() => {
      remove = new RemoveUser(repoMock);
      inputBoundary = {
        get: jest.fn(() => ({ id: "id-00002" })),
      };
      dbUser = new User(userCOMMON_Id);
      dbUser.setIsHashed();
    });

    afterEach(() => jest.clearAllMocks());

    it("Deve remover um usuário corretamente", async () => {
      repoMock.getOne.mockResolvedValue(dbUser);
      repoMock.update.mockResolvedValue(true);

      await expect(remove.execute(inputBoundary)).resolves.toEqual([true]);
      expect(repoMock.getOne).toHaveBeenCalledWith({ id: "id-00002" });
      expect(repoMock.update).toHaveBeenCalled();
    });

    it("Deve retornar false quando não for possivel deletar um usuário", async () => {
      repoMock.getOne.mockResolvedValue(dbUser);
      repoMock.update.mockResolvedValue(false);

      await expect(remove.execute(inputBoundary)).resolves.toEqual([false]);
      expect(repoMock.getOne).toHaveBeenCalledWith({ id: "id-00002" });
      expect(repoMock.update).toHaveBeenCalled();
    });

    it("Deve lançar uma exceção EntityNotFound", async () => {
      repoMock.getOne.mockResolvedValue(null);
      await expect(() => remove.execute(inputBoundary)).rejects.toThrow(
        EntityNotFoundError,
      );
    });
  });
});
