/*
  parâmetros: classe de acesso a banco de dados Repository e uma instancia da classe Cryptography   ✔
  deve ter um método assícrono execute:    ✔
    execute deve ter como parâmetro um InputBoundary e como saída um objeto Partial<UserType>   ✔
    deve validar nome de usuário e senha;   
    deve hashear a senha
    deve passar os dados de User para o repositório para persistir os dados no banco
*/

import { UserType } from "@/@types/types";
import { encryptMock, repoMock } from "@/__test__/__mocks__/interfacesMocks";
import {
  userCOMMON,
  userCOMMON_Id,
  userCOMMON_Output,
} from "@/__test__/__mocks__/userMocks";
import InputBoundary from "@/domain/application/interfaces/InputBoundary";
import CreateUser from "@/domain/application/user/CreateUser/CreateUser";
import User from "@/domain/core/User";
import EntityAlreadyExistsError from "@/domain/errors/EntityAlreadyExistsError";
import InternalError from "@/domain/errors/InternalError";

describe("CreateUser", () => {
  describe("Constructot", () => {
    it("Deve instanciar um objeto da classe CreateUser.", () => {
      expect(new CreateUser(repoMock, encryptMock)).toBeInstanceOf(CreateUser);
    });
  });

  describe("execute", () => {
    afterEach(() => jest.resetAllMocks());
    it("Deve salvar corretamente um usuário.", async () => {
      //entrada do método execute
      const inputMock: jest.Mocked<InputBoundary<UserType>> = {
        get: jest.fn(() => userCOMMON),
      };
      //"passa um hash" na senha do usuário
      encryptMock.encrypt.mockResolvedValue(userCOMMON_Id.password);

      //retorna null se o usuário não existe na base de dados.
      repoMock.getOne.mockResolvedValue(null);
      //retorna user com id se o usuário for salvo na base com sucesso.
      repoMock.save.mockResolvedValue(new User(userCOMMON_Id));

      const user = new CreateUser(repoMock, encryptMock);

      const [methodResponse] = await user.execute(inputMock);

      expect(methodResponse).toEqual(userCOMMON_Output);
      expect(repoMock.getOne).toHaveBeenCalledWith({
        username: userCOMMON.username,
      });
      expect(repoMock.save).toHaveBeenCalled();
    });

    it("Deve lançar uma exceção ao falhar em salvar os dados do usuário na base de dados.", async () => {
      //entrada do método execute
      const inputMock: jest.Mocked<InputBoundary<UserType>> = {
        get: jest.fn(() => userCOMMON),
      };
      //"passa um hash" na senha do usuário
      encryptMock.encrypt.mockResolvedValue(userCOMMON_Id.password);

      //retorna null se o usuário não existe na base de dados.
      repoMock.getOne.mockResolvedValue(null);
      //retorna null se o usuário não for salvo na base.
      repoMock.save.mockResolvedValue(null);

      const user = new CreateUser(repoMock, encryptMock);

      expect(async () => await user.execute(inputMock)).rejects.toThrow(
        InternalError,
      );
      //expect(encryptMock.encrypt).toHaveBeenCalled();
      expect(repoMock.getOne).toHaveBeenCalledWith({
        username: userCOMMON.username,
      });
    });

    it("Deve lançar uma exceção quando o usuário existir na base de dados.", async () => {
      //entrada do método execute
      const inputMock: jest.Mocked<InputBoundary<UserType>> = {
        get: jest.fn(() => userCOMMON),
      };

      //retorna um usuário que existe na base de dados.
      repoMock.getOne.mockResolvedValue(userCOMMON_Id);

      const user = new CreateUser(repoMock, encryptMock);

      expect(async () => await user.execute(inputMock)).rejects.toThrow(
        EntityAlreadyExistsError,
      );
      expect(repoMock.getOne).toHaveBeenCalledWith({
        username: userCOMMON.username,
      });
      expect(encryptMock.encrypt).not.toHaveBeenCalled();
      expect(repoMock.save).not.toHaveBeenCalled();
    });
  });
});
