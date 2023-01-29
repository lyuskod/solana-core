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
    Logger.ready(
      this.#currentServiceName,
      'Ready to get env variable value by key',
      key
    )
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      key,
      'Environment key to get value for'
    )
    let value = process.env[key]

    Logger.success(
      this.#currentServiceName,
      'Success to get env variable value by key',
      `${key}=${value}`
    )
    return value
  }

  static envKeyInitialized(key) {
    Logger.ready(
      this.#currentServiceName,
      'Ready to verify if env variable is initialized',
      key
    )

    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      key,
      'Environment key to check if initialized'
    )
    const isInitialized = !!process.env[key]

    isInitialized
      ? Logger.warn(
          this.#currentServiceName,
          'Environment variable is not initalized',
          key
        )
      : Logger.success(
          this.#currentServiceName,
          'Environment variable is initialized',
          key
        )

    return isInitialized
  }
}
