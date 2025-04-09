/**
  -recebe um objeto com paramatros: username (string - obrigatório), password (string - obrigatório) e role (string - opicional)    ✔
  -possui validação de existência para password   ✔
  -possui validação de existência para username   ✔
  -deve validar existência da user role: caso o input nao possua uma role, deve adicionar por padrão a role: COMMON  ✔
  -retorna um objeto do tipo UserType   ✔
*/

import { UserType } from "@/@types/types";
import CreateUserInputBoundary from "@/domain/application/user/CreateUser/CreateUserInputBoundary";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";

describe("CreateUserInputBoundary", () => {
  describe("Constructor", () => {
    it("Deve instanciar um objeto da classe CreateUserInputBoundary", () => {
      expect(
        new CreateUserInputBoundary({
          username: "john-doe",
          password: "Senha-123",
          role: "ADM",
        }),
      ).toBeInstanceOf(CreateUserInputBoundary);
      expect(
        new CreateUserInputBoundary({
          username: "john-doe",
          password: "Senha-123",
          role: "COMMON",
        }),
      ).toBeInstanceOf(CreateUserInputBoundary);

      expect(
        new CreateUserInputBoundary({
          username: "john-doe",
          password: "Senha-123",
        }),
      ).toBeInstanceOf(CreateUserInputBoundary);
    });

    it("Deve lança exceção RequiredFieldError, quando o username ou password for uma string vazia", () => {
      expect(
        () =>
          new CreateUserInputBoundary({
            username: "",
            password: "Senha-123",
            role: "ADM",
          }),
      ).toThrow(RequiredFieldError);
      expect(
        () =>
          new CreateUserInputBoundary({
            username: "john-doe",
            password: "",
            role: "ADM",
          }),
      ).toThrow(RequiredFieldError);

      expect(
        () =>
          new CreateUserInputBoundary({
            username: "",
            password: "Senha-123",
            role: "COMMON",
          }),
      ).toThrow(RequiredFieldError);
      expect(
        () =>
          new CreateUserInputBoundary({
            username: "john-doe",
            password: "",
            role: "COMMON",
          }),
      ).toThrow(RequiredFieldError);

      expect(
        () =>
          new CreateUserInputBoundary({
            username: "",
            password: "Senha-123",
          }),
      ).toThrow(RequiredFieldError);
      expect(
        () =>
          new CreateUserInputBoundary({
            username: "john-doe",
            password: "",
          }),
      ).toThrow(RequiredFieldError);
    });
  });

  describe("get", () => {
    it("Deve retornar um objeto do tipo UserType, quando o input não possui uma user role definda.", () => {
      const inputData = {
        username: "john-doe",
        password: "Senha-123",
      };
      const input = new CreateUserInputBoundary(inputData);

      expect(input.get()).toEqual({
        role: "COMMON",
        status: "ACTIVE",
        ...inputData,
      });
    });

    it("Deve retornar um objeto do tipo UserType, quando o input possui uma user role definda.", () => {
      const inputData = {
        username: "john-doe",
        password: "Senha-123",
        role: "ADM",
      };
      const input = new CreateUserInputBoundary(inputData as Partial<UserType>);

      expect(input.get()).toEqual({ status: "ACTIVE", ...inputData });
    });

    it("Deve retornar um objeto do tipo UserType, quando o input possui um user status defindo.", () => {
      const inputData = {
        username: "john-doe",
        password: "Senha-123",
        status: "ACTIVE",
      };
      const input = new CreateUserInputBoundary(inputData as Partial<UserType>);

      expect(input.get()).toEqual({ role: "COMMON", ...inputData });
    });
  });
});
