import { Logger } from '../tools/logger.js'

export class ErrorHelper {
  static #currentServiceName = 'Error'
  constructor() {
    if (this instanceof ErrorHelper) {
      const errorMessage = `${ErrorHelper.name} static class cannot be instantiated.`
      Logger.error(ErrorHelper.name, errorMessage)
      throw Error(errorMessage)
    }
  }

  static throwErrorIfUndefinedNullOrEmpty(value, valueName = '') {
    const errorMessage = `${
      valueName ? `${valueName} ` : ''
    }value cannot be null/undefined/empty`

    if (value instanceof Boolean) return

    if (
      value == null ||
      value == undefined ||
      value.length === 0 ||
      value === ''
    ) {
      Logger.error(ErrorHelper.#currentServiceName, errorMessage)
      throw new Error(errorMessage)
    }
  }

  static throwErrorIfValueIsUndefinedOrNull(value, valueName = '') {
    const errorMessage = `${
      valueName ? `${valueName} ` : ''
    }value cannot be null/undefined`

    if (value == null || value == undefined) {
      Logger.error(ErrorHelper.name, errorMessage)
      throw new Error(errorMessage)
    }
  }

  static throwErrorIfArrayIsEmptyOrNullOrUndefined(array, arrayName = '') {
    const errorMessage = `${
      arrayName ? `${arrayName} ` : ''
    }array cannot be null/empty/undefined or have size equal to 0`

    if (!array || array.length == 0) {
      Logger.error(ErrorHelper.name, errorMessage)
      throw new Error(errorMessage)
    }
  }

  static throwErrorIfValueIsNotURL(value, valueName = '') {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(value)
    const errorMessage = `${
      valueName ? `${valueName} ` : ''
    }value is not in url format. Provided value is: ${value}`

    if (!value.match(/^http|https:\/\/.*/)) {
      Logger.error(ErrorHelper.name, errorMessage)
      throw new Error(errorMessage)
    }
  }

  static throwErrorIfValueIsNegative(value, valueName = '') {
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(value, valueName)
    const errorMessage = `${
      valueName ? `${valueName} ` : ''
    }value cannot be negative`

    if (value < 0) {
      Logger.error(ErrorHelper.name, errorMessage)
      throw new Error(errorMessage)
    }
  }
}
