export class ErrorHelper {
  constructor() {
    if (this instanceof ErrorHelper) {
      throw Error('A static class cannot be instantiated.')
    }
  }

  static throwErrorIfUndefinedNullOrEmpty(value, valueName = '') {
    if (!value) {
      throw new Error(
        `${valueName ? valueName : ''}Value cannot be null/undefined/empty`
      )
    }
  }

  static throwErrorIfArrayIsEmptyOrNull(array, arrayName = '') {
    if (array == null || array.length == 0) {
      throw new Error(
        `${arrayName ? arrayName : ''} array cannot be null or empty`
      )
    }
  }
}
