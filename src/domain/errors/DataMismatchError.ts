export default class DataMismatchError extends Error {
  constructor(fieldName: string) {
    super(
      `Data provided in the ${fieldName} field does not match the saved data.`,
    );
  }
}
