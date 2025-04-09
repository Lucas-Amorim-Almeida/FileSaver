import { UserType } from "@/@types/types";
import UseCase from "../../interfaces/UseCase";
import Repository from "@/domain/core/interfaces/Repository";
import InputBoundary from "../../interfaces/InputBoundary";
import EntityAlreadyExistsError from "@/domain/errors/EntityAlreadyExistsError";
import User from "@/domain/core/User";
import Cryptography from "@/domain/interfaces/Cryptography";
import InternalError from "@/domain/errors/InternalError";

export default class CreateUser
  implements UseCase<UserType, Partial<UserType>>
{
  constructor(
    readonly repository: Repository,
    private readonly encrypter: Cryptography,
  ) {}

  async execute(
    inputData: InputBoundary<UserType>,
  ): Promise<Partial<UserType>[]> {
    const userInputData = inputData.get();

    const userData: UserType | null = await this.repository.getOne({
      username: userInputData.username,
    });
    if (userData) {
      throw new EntityAlreadyExistsError("User");
    }

    const user = new User(userInputData);
    await user.encryptPassword(this.encrypter);

    const dbUser: User | null = await this.repository.save(user);

    if (!dbUser) {
      throw new InternalError();
    }

    return [
      {
        username: dbUser.getUsername(),
        role: dbUser.getUserRole(),
        id: dbUser.getId(),
      },
    ];
  }
}
