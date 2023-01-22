export class ErrorHelper {
  constructor() {
    if (this instanceof ErrorHelper) {
      throw Error('A static class cannot be instantiated.')
    }
  }

  static throwErrorIfUndefinedNullOrEmpty(value, valueName = '') {
    if (!value) {
      throw new Error('Value cannot be null/undefined/empty')
    }
  }
}
