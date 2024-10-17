export class NullPointerError extends Error {
  constructor() {
    super(`A null value was found when non null value was expected.`);
  }
}