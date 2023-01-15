import * as dotenv from 'dotenv'
dotenv.config()

export class EnvironmentHelper {
  constructor() {
    if (this instanceof EnvironmentHelper) {
      throw Error('A static class cannot be instantiated.')
    }
  }

  static getEnvValueByKey(key) {
    return process.env[key]
  }
}
