/**
  -recebe UserType   ✔
  -possui validação de password   ✔
  -possui hashing para senha   ✔
  -possui comparação entre hash e plaintext   ✔
  -possui getters e setters   ✔
*/

import { UserType } from "@/@types/types";
import User from "@/domain/core/User";
import InternalError from "@/domain/errors/InternalError";
import InvalidFieldError from "@/domain/errors/InvalidFieldError";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";
import Cryptography from "@/domain/interfaces/Cryptography";

describe("User class", () => {
  describe("Criação de uma instancia da classe User.", () => {
    /** Uma senha válida deve conter:
      - pelo menos 8 caracteres,
      - pelo menos uma letra Maiúscula, 
      - pelo menos uma letra Minúscula,
      - pelo menos um número
      - pelo menos um caractere especial: _-$*&@#
    */

    it("Deve criar uma instáncia da classe user com uma senha válida.", () => {
      const userData: UserType = {
        username: "john_doe",
        password: "abc@ABC@123",
        role: "COMMON",
      };
      expect(new User(userData)).toBeInstanceOf(User);
    });
    it("Deve criar uma instáncia da classe user com uma senha válida, se houver um parâmetro id.", () => {
      const userData: UserType = {
        id: "id-1111",
        username: "john_doe",
        password: "abc@ABC@123",
        role: "COMMON",
      };
      expect(new User(userData)).toBeInstanceOf(User);
    });

    describe("Casos de falha ao criar uma instáncia da classe user, quando um username é inválido.", () => {
      it('Caso de username vazio ("").', () => {
        const userData: UserType = {
          username: "",
          password: "abc@ABC@123",
          role: "COMMON",
        };
        expect(() => new User(userData)).toThrow(RequiredFieldError);
      });
      it("Caso de um username com espaço.", () => {
        const userData: UserType = {
          username: "john doe",
          password: "abc@ABC@123",
          role: "COMMON",
        };
        expect(() => new User(userData)).toThrow(InvalidFieldError);
      });
      it("Caso de um username com caractere especial (exceto - e _).", () => {
        const userData: UserType = {
          username: "john doe",
          password: "@abc-ABC-123",
          role: "COMMON",
        };
        expect(() => new User(userData)).toThrow(InvalidFieldError);
      });
      it("Caso de um username começa com número.", () => {
        const userData: UserType = {
          username: "2025john doe",
          password: "@abc-ABC-123",
          role: "COMMON",
        };
        expect(() => new User(userData)).toThrow(InvalidFieldError);
      });
    });

    describe("Casos de falha ao criar uma instáncia da classe user, quando uma senha inválida for fornecido.", () => {
      it('Caso de senha vazia("").', () => {
        const userData: UserType = {
          username: "johndoe",
          password: "",
          role: "COMMON",
        };
        expect(() => new User(userData)).toThrow(RequiredFieldError);
      });
      it("Caso de senha menor que 8 caracteres.", () => {
        const userData: UserType = {
          username: "john_doe",
          password: "a@ABC@1",
          role: "COMMON",
        };
        expect(() => new User(userData)).toThrow(InvalidFieldError);
      });
      it("Caso de senha sem letras minúsculas.", () => {
        const userData: UserType = {
          username: "john_doe",
          password: "ABCD@1234",
          role: "COMMON",
        };
        expect(() => new User(userData)).toThrow(InvalidFieldError);
      });
      it("Caso de senha sem letras maiúsculas.", () => {
        const userData: UserType = {
          username: "john_doe",
          password: "abcd@1234",
          role: "COMMON",
        };
        expect(() => new User(userData)).toThrow(InvalidFieldError);
      });
      it("Caso de senha sem caracteres especiais.", () => {
        const userData: UserType = {
          username: "john_doe",
          password: "abcd1234",
          role: "COMMON",
        };
        expect(() => new User(userData)).toThrow(InvalidFieldError);
      });
    });
  });

  describe("Hash de senha", () => {
    it("Deve converter a senha em um hash com sucesso.", async () => {
      const hasherMock: jest.Mocked<Cryptography> = {
        encrypt: jest.fn(),
        compare: jest.fn(),
      };
      hasherMock.encrypt.mockResolvedValue("passwordHashed");

      const userData: UserType = {
        username: "john_doe",
        password: "abc@ABC@123",
        role: "COMMON",
      };

      const user = new User(userData);
      await user.encryptPassword(hasherMock);

      expect(user.getIsHashed()).toBe(true);
      expect(user.getPassword()).toBe("passwordHashed");
    });

    describe("Comparação entre uma senha em plaintext com um hash", () => {
      it("Deve retornar true se o hash for gerado a partir da senha.", async () => {
        const hasherMock: jest.Mocked<Cryptography> = {
          encrypt: jest.fn(),
          compare: jest.fn(),
        };
        hasherMock.compare.mockResolvedValue(true);

        const userData: UserType = {
          username: "john_doe",
          password: "abc@ABC@123",
          role: "COMMON",
        };

        const user = new User(userData);

        const hash = "hashMockabc@ABC@123";
        expect(user.passwordCompare(hasherMock, hash)).resolves.toBe(true);
      });
      it("Deve retornar false se o não hash for gerado a partir da senha.", async () => {
        const hasherMock: jest.Mocked<Cryptography> = {
          encrypt: jest.fn(),
          compare: jest.fn(),
        };
        hasherMock.compare.mockResolvedValue(false);

        const userData: UserType = {
          username: "john_doe",
          password: "abc@ABC@123",
          role: "COMMON",
        };

        const user = new User(userData);

        const hash = "hashMockabc@ABC@123";
        expect(user.passwordCompare(hasherMock, hash)).resolves.toBe(false);
      });
      it("Deve retornar erro se a senha da classe user já for um hash", async () => {
        const hasherMock: jest.Mocked<Cryptography> = {
          encrypt: jest.fn(),
          compare: jest.fn(),
        };
        hasherMock.encrypt.mockResolvedValue("passwordHashed");
        hasherMock.compare.mockResolvedValue(false);

        const userData: UserType = {
          username: "john_doe",
          password: "abc@ABC@123",
          role: "COMMON",
        };

        const user = new User(userData);

        await user.encryptPassword(hasherMock);

        const hash = "hashMockabc@ABC@123";
        expect(user.passwordCompare(hasherMock, hash)).rejects.toThrow(
          InternalError,
        );
      });
    });
  });
});
