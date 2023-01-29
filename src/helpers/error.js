import { Logger } from '../tools/logger.js'

export class ErrorHelper {
  static #currentServiceName = 'Error Checker'
  constructor() {
    if (this instanceof ErrorHelper) {
      const errorMessage = `${ErrorHelper.name} static class cannot be instantiated.`
      Logger.error(ErrorHelper.name, errorMessage)
      throw Error(errorMessage)
    }
  }

  /**
   * @description Check value for equality to undefined/null/empty
   * @param {String} value - Value to check
   * @param {String} valueName - Meaningful name of the value to log
   * @throws {Error} - Throws an error '${valueName} value cannot be null/undefined/empty'
   */
  static throwErrorIfUndefinedNullOrEmpty(value, valueName = '') {
    Logger.ready(
      ErrorHelper.#currentServiceName,
      'Ready to validate value for null/empty/undefined',
      {
        value,
        valueName,
      }
    )
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

    Logger.success(
      ErrorHelper.#currentServiceName,
      'Success to validate value for null/empty/undefined. Value is valid',
      {
        value,
        valueName,
      }
    )
  }

  /**
   * @description Check value for equality to undefined/null
   * @param {String} value - Value to check
   * @param {String} valueName - Meaningful name of the value to log
   * @throws {Error} - Throws an error '${valueName} value cannot be null/undefined'
   */
  static throwErrorIfValueIsUndefinedOrNull(value, valueName = '') {
    Logger.ready(
      ErrorHelper.#currentServiceName,
      'Ready to validate value for null/undefined',
      {
        value,
        valueName,
      }
    )
    const errorMessage = `${
      valueName ? `${valueName} ` : ''
    }value cannot be null/undefined`

    if (value == null || value == undefined) {
      Logger.error(ErrorHelper.name, errorMessage)
      throw new Error(errorMessage)
    }

    Logger.success(
      ErrorHelper.#currentServiceName,
      'Success to validate value for null/undefined. Value is valid',
      {
        value,
        valueName,
      }
    )
  }

  /**
   * @description Check array for equality to undefined/null
   * @param {Array<any>} array - Array to check
   * @param {String} arrayName - Meaningful name of the array to log
   * @throws {Error} - Throws an error '${valueName} array cannot be null/empty/undefined or have size equal to 0'
   */
  static throwErrorIfArrayIsEmptyOrNullOrUndefined(array, arrayName = '') {
    Logger.ready(
      ErrorHelper.#currentServiceName,
      'Ready to validate array for [size == 0, null, empty] checks',
      {
        array,
        arrayName,
      }
    )
    const errorMessage = `${
      arrayName ? `${arrayName} ` : ''
    }array cannot be null/empty/undefined or have size equal to 0`

    if (!array || array.length == 0) {
      Logger.error(ErrorHelper.name, errorMessage)
      throw new Error(errorMessage)
    }

    Logger.success(
      ErrorHelper.#currentServiceName,
      'Success to validate array for [size == 0, null, empty] checks. Array is valid',
      {
        array,
        arrayName,
      }
    )
  }

  /**
   * @description Check value for match the url pattern
   * @param {String} value - Value to check
   * @param {String} valueName - Meaningful name of the value to log
   * @throws {Error} - Throws an error '${valueName} value is not in url format. Provided value is: ${value}'
   */
  static throwErrorIfValueIsNotURL(value, valueName = '') {
    Logger.ready(
      ErrorHelper.#currentServiceName,
      'Ready to validate value to be in valid URL format',
      {
        value,
        valueName,
      }
    )
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(value)

    const errorMessage = `${
      valueName ? `${valueName} ` : ''
    }value is not in url format. Provided value is: ${value}. Probably missed the: https or http wordings`

    if (!value.match(/^http|https:\/\/.*/)) {
      Logger.error(ErrorHelper.name, errorMessage)
      throw new Error(errorMessage)
    }

    Logger.success(
      ErrorHelper.#currentServiceName,
      'Success to validate value to be in valid URL format. Value is URL',
      {
        value,
        valueName,
      }
    )
  }

  /**
   * @description Check value for negativity
   * @param {Number} value - Value to check
   * @param {String} valueName - Meaningful name of the value to log
   * @throws {Error} - Throws an error '${valueName} value cannot be negative'
   */
  static throwErrorIfValueIsNegative(value, valueName = '') {
    Logger.ready(
      ErrorHelper.#currentServiceName,
      'Ready to validate value not to be negative',
      {
        value,
        valueName,
      }
    )
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(value, valueName)
    const errorMessage = `${
      valueName ? `${valueName} ` : ''
    }value cannot be negative`

    if (value < 0) {
      Logger.error(ErrorHelper.name, errorMessage)
      throw new Error(errorMessage)
    }

    Logger.success(
      ErrorHelper.#currentServiceName,
      'Success to validate value not to be negative. Value is positive',
      {
        value,
        valueName,
      }
    )
  }
}
