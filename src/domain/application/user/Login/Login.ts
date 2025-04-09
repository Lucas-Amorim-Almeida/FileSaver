import UseCase from "../../interfaces/UseCase";
import { UserType } from "@/@types/types";
import Repository from "@/domain/core/interfaces/Repository";
import Cryptography from "@/domain/interfaces/Cryptography";
import InputBoundary from "../../interfaces/InputBoundary";
import User from "@/domain/core/User";
import EntityNotFoundError from "@/domain/errors/EntityNotFoundError";
import DataMismatchError from "@/domain/errors/DataMismatchError";

export default class Login
  implements UseCase<Partial<UserType>, Partial<UserType>>
{
  constructor(
    readonly repository: Repository,
    readonly encrypter: Cryptography,
  ) {}

  async execute(
    inputData: InputBoundary<Partial<UserType>>,
  ): Promise<Partial<UserType>[]> {
    const { username, password } = inputData.get();

    const dbUser: User | null = await this.repository.getOne({ username });
    if (!dbUser) {
      throw new EntityNotFoundError("User");
    }

    const passwordComparation = await dbUser.passwordCompare(
      this.encrypter,
      password!,
    );
    if (!passwordComparation) {
      throw new DataMismatchError("password");
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
