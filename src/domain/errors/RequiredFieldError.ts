export default class RequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`${fieldName} is required.`);
  }
}
