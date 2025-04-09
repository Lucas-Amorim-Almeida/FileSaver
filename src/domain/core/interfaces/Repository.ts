export default interface Repository {
  save<T, S>(data: T): Promise<S | null>;
  getOne<T, S>(queryOptions: T): Promise<S | null>;
  getMany<T, S>(queryOptions: T): Promise<S[]>;
  getAll<T, S>(queryOptions?: T): Promise<S[]>;
  update<T>(updateOptions: T): Promise<boolean>;
  delete<T>(queryOptions: T): Promise<boolean>;
}
