/**
  -recebe um objeto com paramatros: username (string - obrigatório), password (string - obrigatório)   ✔
  -possui validação de existência para password   ✔
  -possui validação de existência para username   ✔
  -retorna um objeto do tipo Partial<UserType>   ✔
*/

import LoginInputBoundary from "@/domain/application/user/Login/LoginInputBoundary";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";

describe("LoginInputBoundary", () => {
  const loginData = {
    username: "john-doe",
    password: "abc@ABC@123",
  };

  describe("Constructor", () => {
    it("Deve instanciar um objeto da classe LoginInputBoundary.", () => {
      expect(new LoginInputBoundary(loginData)).toBeInstanceOf(
        LoginInputBoundary,
      );
    });
    it("Deve lançar uma exceção RequiredFieldError quando o username for uma string vazia.", () => {
      expect(
        () =>
          new LoginInputBoundary({
            username: "",
            password: "abc@ABC@123",
          }),
      ).toThrow(RequiredFieldError);
    });
    it("Deve lançar uma exceção RequiredFieldError quando a senha for uma string vazia.", () => {
      expect(
        () =>
          new LoginInputBoundary({
            username: "john-doe",
            password: "",
          }),
      ).toThrow(RequiredFieldError);
    });
  });

  describe("get", () => {
    const input = new LoginInputBoundary(loginData);

    expect(input.get()).toEqual(loginData);
  });
});
