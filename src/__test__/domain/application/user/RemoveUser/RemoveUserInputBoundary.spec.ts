/**
  -recebe um objeto com paramatros: id (string - obrigatório)   ✔
  -possui validação de existência para id   ✔
  -retorna um objeto do tipo Partial<UserType>   ✔
*/

import RemoveUserInputBoundary from "@/domain/application/user/RemoveUser/RemoveUserInputBoundary";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";

describe("RemoveUserInputBoundary", () => {
  const userData = {
    id: "id-00002",
  };

  describe("Constructor", () => {
    it("Deve instanciar um objeto da classe RemoveUserInputBoundary.", () => {
      expect(new RemoveUserInputBoundary(userData)).toBeInstanceOf(
        RemoveUserInputBoundary,
      );
    });
    it("Deve lançar uma exceção RequiredFieldError quando o user id for uma string vazia.", () => {
      expect(
        () =>
          new RemoveUserInputBoundary({
            id: "",
          }),
      ).toThrow(RequiredFieldError);
    });
  });

  describe("get", () => {
    const input = new RemoveUserInputBoundary(userData);

    expect(input.get()).toEqual(userData);
  });
});
