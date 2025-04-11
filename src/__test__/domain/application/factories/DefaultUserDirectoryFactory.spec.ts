import { nodeManager } from "@/__test__/__mocks__/interfacesMocks";
import { userCOMMON_Id } from "@/__test__/__mocks__/userMocks";
import DefaultUserDirectoryFactory from "@/domain/application/factories/DefaultUserDirectoryFactory";
import User from "@/domain/core/User";

describe("DefaultUserDirectoryFactory", () => {
  let user: User;
  let userDirFactory: DefaultUserDirectoryFactory;
  beforeEach(() => {
    user = new User(userCOMMON_Id);
    userDirFactory = new DefaultUserDirectoryFactory(nodeManager);
  });
  afterEach(() => jest.clearAllMocks());

  describe("Constructor", () => {
    it("Deve instanciar um objeto da classe DefaultUserDirectoryFactory.", () => {
      expect(userDirFactory).toBeInstanceOf(DefaultUserDirectoryFactory);
    });
  });

  describe("createFor", () => {
    it("Deve retornar undefined (por ter retorno void) ao ter sucesso na criação do diretório", async () => {
      await expect(userDirFactory.createFor(user)).resolves.toBeUndefined();
    });
  });

  describe("removeFor", () => {
    it("Deve retornar undefined (por ter retorno void) ao ter sucesso na remoção do diretório", async () => {
      await expect(userDirFactory.removeFor(user)).resolves.toBeUndefined();
    });
  });
});
