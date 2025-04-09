/*
  -recebe um objeto com paramatros: current_password (string - obrigatório), new_password (string - obrigatório)    ✔
  -possui validação de existência para senha atual   ✔
  -possui validação de existência para nova senha   ✔
  -possui validação de igualdade entre as senhas, se forem iguais lança exceção   ✔
  -retorna um objeto do tipo: UpdateUser --> {current: Partial<User>, update: Partial<User>}   ✔
*/

import ChangePasswordInputBoundary from "@/domain/application/user/ChangePassword/ChangePasswordInputBoundary";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";
import SameContentFieldsError from "@/domain/errors/SameContentFieldsError";

describe("ChangePasswordInputBoundary", () => {
  describe("Constructor", () => {
    it("Deve instanciar um objeto da classe ChangePasswordInputBoundary.", () => {
      expect(
        new ChangePasswordInputBoundary({
          id: "id-00001",
          current_password: "a$BC12345",
          new_password: "ab$C12345",
        }),
      ).toBeInstanceOf(ChangePasswordInputBoundary);
    });

    it("Deve lançar um exceção RequiredFieldError quando algum dos campos da entrada está preenchido com string vazia.", () => {
      expect(
        () =>
          new ChangePasswordInputBoundary({
            id: "id-00001",
            current_password: "",
            new_password: "ab$C12345",
          }),
      ).toThrow(RequiredFieldError);
      expect(
        () =>
          new ChangePasswordInputBoundary({
            id: "id-00001",
            current_password: "a$BC12345",
            new_password: "",
          }),
      ).toThrow(RequiredFieldError);
    });

    it("Deve lançar um exceção SameContentFieldsError quando algum dos campos da entrada estiverem preenchidos com a mesma string.", () => {
      expect(
        () =>
          new ChangePasswordInputBoundary({
            id: "id-00001",
            current_password: "a$BC12345",
            new_password: "a$BC12345",
          }),
      ).toThrow(SameContentFieldsError);
    });
  });

  describe("get", () => {
    it("Deve retornar um objeto contendo Partials do type UserType", () => {
      const inputData = {
        id: "id-00001",
        current_password: "a$BC12345",
        new_password: "ab$C12345",
      };
      const input = new ChangePasswordInputBoundary(inputData);

      expect(input.get()).toEqual({
        current: {
          id: "id-00001",
          password: inputData.current_password,
        },
        update: { password: inputData.new_password },
      });
    });
  });
});
