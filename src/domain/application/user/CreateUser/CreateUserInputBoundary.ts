import { UserRoles, UserStatus, UserType } from "@/@types/types";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";
import InputBoundary from "../../interfaces/InputBoundary";

export default class CreateUserInputBoundary
  implements InputBoundary<UserType>
{
  private readonly username: string;
  private readonly password: string;
  private readonly role: UserRoles;
  private readonly status: UserStatus;

  constructor({
    username,
    password,
    role = "COMMON",
    status = "ACTIVE",
  }: Partial<UserType>) {
    if (!username || !password) {
      throw new RequiredFieldError(!username ? "Username" : "Password");
    }
    this.username = username;
    this.password = password;
    this.role = role;
    this.status = status;
  }

  get(): UserType {
    return {
      username: this.username,
      password: this.password,
      role: this.role,
      status: this.status,
    };
  }
}
