export default class SameContentFieldsError extends Error {
  constructor(stFieldName: string, ndFieldName: string) {
    super(`${stFieldName} and ${ndFieldName} must not be equal.`);
  }
}
