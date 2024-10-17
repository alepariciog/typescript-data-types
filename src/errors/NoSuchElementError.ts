export class NoSuchElementError extends Error {
  constructor() {
    super(`A value was expected, but none was found.`);
  }
}
