import * as dotenv from 'dotenv'
import { ErrorHelper } from '../helpers/error.js'
import { Logger } from './logger.js'
dotenv.config()

export class Environment {
  static #currentServiceName = 'Environment'
  constructor() {
    if (this instanceof Environment) {
      const errorMessage = `${Environment.name} static class cannot be instantiated.`
      Logger.error(Environment.name, errorMessage)
      throw Error(errorMessage)
    }
  }

  /**
   * @description Get environment variable value
   * @param {String} key - Environment variable key to get value for
   * @returns {String}
   */
  static getEnvValueByKey(key) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      key,
      'Environment key to get value for'
    )
    return process.env[key]
  }

  static envKeyInitialized(key) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      key,
      'Environment key to check if initialized'
    )
    return !!process.env[key]
  }
}
