import { userADM_Id } from "@/__test__/__mocks__/userMocks";
import Root from "@/domain/core/Root";
import User from "@/domain/core/User";
import * as config from "../../../../config/config.json";

describe("Root", () => {
  describe("Constructor", () => {
    it("Deve instanciar um objeto da classe Root", () => {
      const user = new User(userADM_Id);
      expect(new Root(user)).toBeInstanceOf(Root);
    });

    it("O nome da root deve conter um path absoluto específico contido em /config/config.json", () => {
      const user = new User(userADM_Id);
      const root = new Root(user);

      expect(root.getName()).toBe(`${config.ROOT_DIR}${user.getUsername()}`);
    });

    it("Root deve ser uma raiz", () => {
      const user = new User(userADM_Id);
      const root = new Root(user);

      expect(root.isRootDir()).toBe(true);
    });
  });
});
