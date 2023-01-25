import { LoggerTool } from '../tools/logger-tool.js'
export class ErrorHelper {
  constructor() {
    if (this instanceof ErrorHelper) {
      LoggerTool.error(
        ErrorHelper.name,
        `${ErrorHelper.name} static class cannot be instantiated.`
      )
      throw Error(`${ErrorHelper.name} static class cannot be instantiated.`)
    }
  }

  static throwErrorIfUndefinedNullOrEmpty(value, valueName = '') {
    if (!value) {
      LoggerTool.error(
        ErrorHelper.name,
        `${
          valueName ? `${valueName} ` : ''
        }value cannot be null/undefined/empty`
      )
      throw new Error(
        `${
          valueName ? `${valueName} ` : ''
        }value cannot be null/undefined/empty`
      )
    }
  }

  static throwErrorIfArrayIsEmptyOrNull(array, arrayName = '') {
    if (!array || array.length == 0) {
      LoggerTool.error(
        ErrorHelper.name,
        `${
          arrayName ? `${arrayName} ` : ''
        }array cannot be null/empty/undefined or have size equal to 0`
      )
      throw new Error(
        `${
          arrayName ? `${arrayName} ` : ''
        }array cannot be null/empty/undefined or have size equal to 0`
      )
    }
  }

  static throwErrorIfValueIsNotURL(value, valueName = '') {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(value)
    if (!value.match(/^http|https:\/\/.*/)) {
      LoggerTool.error(
        ErrorHelper.name,
        `${
          valueName ? `${valueName} ` : ''
        }value is not in url format. Provided value is: ${value}`
      )
      throw new Error(
        `${
          valueName ? `${valueName} ` : ''
        }value is not in url format. Provided value is: ${value}`
      )
    }
  }
}
