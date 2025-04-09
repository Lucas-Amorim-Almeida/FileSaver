import { UpdateUser, UserType } from "@/@types/types";
import UseCase from "../../interfaces/UseCase";
import Repository from "@/domain/core/interfaces/Repository";
import Cryptography from "@/domain/interfaces/Cryptography";
import InputBoundary from "../../interfaces/InputBoundary";
import EntityNotFoundError from "@/domain/errors/EntityNotFoundError";
import User from "@/domain/core/User";
import InvalidFieldError from "@/domain/errors/InvalidFieldError";
import InternalError from "@/domain/errors/InternalError";

export default class ChangePassword
  implements UseCase<UpdateUser, Partial<UserType>>
{
  constructor(
    readonly repository: Repository,
    private readonly encrypter: Cryptography,
  ) {}

  async execute(
    inputData: InputBoundary<UpdateUser>,
  ): Promise<Partial<UserType>[]> {
    const { current, update } = inputData.get();

    const dbUser: User | null = await this.repository.getOne({
      id: current?.id,
    });
    if (!dbUser) {
      throw new EntityNotFoundError("User");
    }

    const passwordComparation = await dbUser.passwordCompare(
      this.encrypter,
      update.password!,
    );
    if (!passwordComparation) {
      throw new InvalidFieldError("New passwor");
    }
    dbUser.setPassword(update.password!);
    if (!dbUser.getIsHashed()) {
      await dbUser.encryptPassword(this.encrypter);
    }

    const updatedUser = await this.repository.update({
      query: { id: dbUser.getId() },
      update_fields: dbUser,
    });
    if (!updatedUser) {
      throw new InternalError();
    }

    return [
      {
        id: dbUser.getId(),
        username: dbUser.getUsername(),
        role: dbUser.getUserRole(),
      },
    ];
  }
}
