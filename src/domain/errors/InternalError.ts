export default class InternalError extends Error {
  constructor() {
    super("An internal error occurred.");
  }
}
