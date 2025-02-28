export default class InvalidFieldError extends Error {
  constructor(fieldName: string) {
    super(`${fieldName} is not valid.`);
  }
}
