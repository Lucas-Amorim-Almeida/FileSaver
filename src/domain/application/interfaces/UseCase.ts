import Repository from "@/domain/core/interfaces/Repository";
import InputBoundary from "./InputBoundary";

export default interface UseCase<T, K> {
  readonly repository: Repository;
  execute(inputData: InputBoundary<T>): Promise<K[]>;
}
