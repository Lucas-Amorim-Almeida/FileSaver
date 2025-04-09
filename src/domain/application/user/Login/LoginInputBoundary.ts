import { UserType } from "@/@types/types";
import InputBoundary from "../../interfaces/InputBoundary";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";

export default class LoginInputBoundary
  implements InputBoundary<Partial<UserType>>
{
  private username: string;
  private password: string;

  constructor({ username, password }: Partial<UserType>) {
    if (!username || !password) {
      throw new RequiredFieldError(!username ? "username" : "password");
    }
    this.username = username;
    this.password = password;
  }

  get(): Partial<UserType> {
    return {
      username: this.username,
      password: this.password,
    };
  }
}
