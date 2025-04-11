import User from "@/domain/core/User";

export default interface UserDirectoryFactory {
  createFor(user: User): Promise<void>;
  removeFor(user: User): Promise<void>;
}
