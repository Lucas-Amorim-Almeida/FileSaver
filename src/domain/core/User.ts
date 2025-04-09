import { UserRoles, UserStatus, UserType } from "@/@types/types";
import RequiredFieldError from "../errors/RequiredFieldError";
import InvalidFieldError from "../errors/InvalidFieldError";
import Cryptography from "../interfaces/Cryptography";
import InternalError from "../errors/InternalError";

export default class User {
  private user: UserType;
  private isHashed: boolean = false;

  constructor(user: UserType) {
    if (!this.isUsernameValid(user.username)) {
      throw new InvalidFieldError("username");
    }
    if (!this.isPasswordValid(user.password)) {
      throw new InvalidFieldError("password");
    }

    this.user = user;
  }

  private isUsernameValid(username: string): boolean {
    if (!username) {
      throw new RequiredFieldError("username");
    }

    const usernameRegex = /^(?![\d])[a-zA-Z0-9_-]+$/i;

    return usernameRegex.test(username) || !username.includes(" ");
  }

  private isPasswordValid(password: string): boolean {
    if (!password) {
      throw new RequiredFieldError("password");
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;

    return passwordRegex.test(password);
  }

  async encryptPassword(encrypter: Cryptography): Promise<void> {
    const hashedPassword = await encrypter.encrypt(this.user.password);
    this.user.password = hashedPassword;
    this.isHashed = true;
  }

  async passwordCompare(
    encrypter: Cryptography,
    plainPassword: string,
  ): Promise<boolean> {
    if (!this.isHashed) {
      throw new InternalError();
    }
    return await encrypter.compare(plainPassword, this.user.password);
  }

  getIsHashed(): boolean {
    return this.isHashed;
  }

  getPassword(): string {
    return this.user.password;
  }

  getId(): string | undefined {
    return this.user.id;
  }

  getUsername(): string {
    return this.user.username;
  }

  getUserRole(): UserRoles {
    return this.user.role;
  }

  getStatus(): UserStatus {
    return this.user.status;
  }
  setPassword(newPassword: string): void {
    if (!this.isPasswordValid(newPassword)) {
      throw new InvalidFieldError("password");
    }
    this.user.password = newPassword;
    this.isHashed = false;
  }

  setId(id: string): void {
    if (!id) {
      throw new InvalidFieldError("Id");
    }
    this.user.id = id;
  }

  setIsHashed(isHashed: boolean = true): void {
    this.isHashed = isHashed;
  }

  setStatus(status: UserStatus): void {
    this.user.status = status;
  }
}
