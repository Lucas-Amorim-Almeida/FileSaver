/*
  parâmetros: classe de acesso a banco de dados Repository e uma instancia da classe Cryptography   ✔
  deve ter um método assícrono execute:    ✔
    execute deve ter como parâmetro um InputBoundary e como saída uma mensagem de sucesso   ✔
    deve validar a senha atual com a do banco de dados;   
    deve hashear a nova senha
    deve passar os dados de sob forma de um User para o repositório para persistir os dados no banco
*/

import { UpdateUser } from "@/@types/types";
import { encryptMock, repoMock } from "@/__test__/__mocks__/interfacesMocks";
import { userCOMMON_Id } from "@/__test__/__mocks__/userMocks";
import InputBoundary from "@/domain/application/interfaces/InputBoundary";
import ChangePassword from "@/domain/application/user/ChangePassword/ChangePassword";
import User from "@/domain/core/User";
import EntityNotFoundError from "@/domain/errors/EntityNotFoundError";
import InternalError from "@/domain/errors/InternalError";
import InvalidFieldError from "@/domain/errors/InvalidFieldError";

const inputBoundary: jest.Mocked<InputBoundary<UpdateUser>> = {
  get: jest.fn(() => ({
    current: {
      id: "id-00001",
      password: "abc@ABC@123",
    },
    update: { password: "ab$C12345" },
  })),
};
describe("ChangePassword", () => {
  describe("constructor", () => {
    it("Deve instanciar um objeto da classe ChangePassword.", () => {
      expect(new ChangePassword(repoMock, encryptMock)).toBeInstanceOf(
        ChangePassword,
      );
    });
  });

  describe("execute", () => {
    afterEach(() => jest.clearAllMocks());

    it("Deve alterar e salvar a nova senha no banco com sucesso.", async () => {
      const hashedNewPassword = "HASH$$$ab$C12345";
      const mockUser = new User(userCOMMON_Id);
      mockUser.setIsHashed();
      repoMock.getOne.mockResolvedValue(mockUser);
      encryptMock.compare.mockResolvedValue(true);
      encryptMock.encrypt.mockResolvedValue(hashedNewPassword);
      repoMock.update.mockResolvedValue(true);

      const changePassword = new ChangePassword(repoMock, encryptMock);

      await expect(
        changePassword.execute(inputBoundary),
      ).resolves.toBeInstanceOf(Array);

      const [updatedUser] = await changePassword.execute(inputBoundary);
      expect(updatedUser).toEqual({
        id: userCOMMON_Id.id,
        username: userCOMMON_Id.username,
        role: userCOMMON_Id.role,
      });

      expect(repoMock.getOne).toHaveBeenCalledWith({
        id: inputBoundary.get().current?.id,
      });
      expect(encryptMock.compare).toHaveBeenCalled();
      expect(encryptMock.encrypt).toHaveBeenCalled();
      expect(repoMock.update).toHaveBeenCalled();
    });

    it("Deve retornar false ao tentar atualizar a base de dados.", async () => {
      const mockUser = new User(userCOMMON_Id);
      mockUser.setIsHashed();
      repoMock.getOne.mockResolvedValue(mockUser);
      encryptMock.compare.mockResolvedValue(true);
      repoMock.update.mockResolvedValue(false);

      const changePassword = new ChangePassword(repoMock, encryptMock);

      await expect(() => changePassword.execute(inputBoundary)).rejects.toThrow(
        InternalError,
      );
      expect(repoMock.getOne).toHaveBeenCalledWith({
        id: inputBoundary.get().current?.id,
      });
      expect(encryptMock.compare).toHaveBeenCalled();
    });

    it("Deve lança uma exceção InvalidFieldError quando a nova senha não for válida", async () => {
      const inputBoundaryInvalid: jest.Mocked<InputBoundary<UpdateUser>> = {
        get: jest.fn(() => ({
          current: {
            id: "id-00001",
            password: "abc@ABC@123",
          },
          update: { password: "abc12345" },
        })),
      };
      const mockUser = new User(userCOMMON_Id);
      mockUser.setIsHashed();
      repoMock.getOne.mockResolvedValue(mockUser);
      encryptMock.compare.mockResolvedValue(true);

      const changePassword = new ChangePassword(repoMock, encryptMock);

      await expect(() =>
        changePassword.execute(inputBoundaryInvalid),
      ).rejects.toThrow(InvalidFieldError);
      expect(repoMock.getOne).toHaveBeenCalledWith({
        id: inputBoundaryInvalid.get().current?.id,
      });
      expect(encryptMock.compare).toHaveBeenCalled();
    });

    it("Deve lança uma exceção InvalidFieldError quando a senha atual não corresponder a senha salva no banco", async () => {
      const mockUser = new User(userCOMMON_Id);
      mockUser.setIsHashed();
      repoMock.getOne.mockResolvedValue(mockUser);
      encryptMock.compare.mockResolvedValue(false);

      const changePassword = new ChangePassword(repoMock, encryptMock);

      await expect(() => changePassword.execute(inputBoundary)).rejects.toThrow(
        InvalidFieldError,
      );
      expect(repoMock.getOne).toHaveBeenCalledWith({
        id: inputBoundary.get().current?.id,
      });
      expect(encryptMock.compare).toHaveBeenCalled();
    });

    it("Deve lança uma exceção EntityNotFound quando o usuário não for encontrado", async () => {
      repoMock.getOne.mockResolvedValue(null);

      const changePassword = new ChangePassword(repoMock, encryptMock);

      expect(
        async () => await changePassword.execute(inputBoundary),
      ).rejects.toThrow(EntityNotFoundError);
      expect(repoMock.getOne).toHaveBeenCalledWith({
        id: inputBoundary.get().current?.id,
      });
    });
  });
});
