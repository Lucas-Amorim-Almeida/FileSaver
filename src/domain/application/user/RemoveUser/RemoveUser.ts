import { UserType } from "@/@types/types";
import UseCase from "../../interfaces/UseCase";
import Repository from "@/domain/core/interfaces/Repository";
import InputBoundary from "../../interfaces/InputBoundary";
import EntityNotFoundError from "@/domain/errors/EntityNotFoundError";
import User from "@/domain/core/User";

export default class RemoveUser implements UseCase<Partial<UserType>, boolean> {
  constructor(readonly repository: Repository) {}

  async execute(
    inputData: InputBoundary<Partial<UserType>>,
  ): Promise<boolean[]> {
    const { id } = inputData.get();

    const dbUser: User | null = await this.repository.getOne({ id });
    if (!dbUser) {
      throw new EntityNotFoundError("User");
    }

    dbUser.setStatus("DELETED");
    const deleteResponse = await this.repository.update({
      query: { id: dbUser.getId() },
      update_fields: dbUser,
    });

    return [deleteResponse];
  }
}
