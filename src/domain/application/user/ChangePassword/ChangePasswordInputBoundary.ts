import { UpdateUser } from "@/@types/types";
import InputBoundary from "../../interfaces/InputBoundary";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";
import SameContentFieldsError from "@/domain/errors/SameContentFieldsError";

export default class ChangePasswordInputBoundary
  implements InputBoundary<UpdateUser>
{
  private readonly id: string;
  private readonly current_password: string;
  private readonly new_password: string;

  constructor({
    id,
    current_password,
    new_password,
  }: {
    id: string;
    current_password: string;
    new_password: string;
  }) {
    if (!current_password || !new_password) {
      throw new RequiredFieldError(
        `${!current_password ? new_password : current_password} is required.`,
      );
    }

    if (current_password === new_password) {
      throw new SameContentFieldsError("current_password", "new_password");
    }
    this.current_password = current_password;
    this.new_password = new_password;
    this.id = id;
  }

  get(): UpdateUser {
    return {
      current: {
        id: this.id,
        password: this.current_password,
      },
      update: { password: this.new_password },
    };
  }
}
