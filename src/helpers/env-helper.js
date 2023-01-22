import * as dotenv from 'dotenv'
import { ErrorHelper } from './error-helper'
dotenv.config()

export class EnvironmentHelper {
  constructor() {
    if (this instanceof EnvironmentHelper) {
      throw Error('A static class cannot be instantiated.')
    }
  }

  static getEnvValueByKey(key) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(key)
    return process.env[key]
  }
}
