import { UserType } from "@/@types/types";
import InputBoundary from "../../interfaces/InputBoundary";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";

export default class RemoveUserInputBoundary
  implements InputBoundary<Partial<UserType>>
{
  private id: string;

  constructor({ id }: Partial<UserType>) {
    if (!id) {
      throw new RequiredFieldError("ID");
    }
    this.id = id;
  }

  get(): Partial<UserType> {
    return { id: this.id };
  }
}
