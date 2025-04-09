export default class EntityAlreadyExistsError extends Error {
  constructor(entityName: string) {
    super(`${entityName} Already Exists.`);
  }
}
