import * as dotenv from 'dotenv'
import { ErrorHelper } from './error-helper.js'
import fs from 'fs'
dotenv.config()

export class ConfigHelper {
  static #configPath = './config.json'
  constructor() {
    if (this instanceof ConfigHelper) {
      throw Error('A static class cannot be instantiated.')
    }
  }

  /**
   *
   * @returns {String}
   */
  static getFeePayerPublicKey() {
    return ConfigHelper.#readConfig().feePayerPublicKey
  }

  /**
   *
   * @returns {String}
   */
  static getFeePayerPrivateKey() {
    return ConfigHelper.#readConfig().feePayerPrivateKey
  }

  static getExpectedSalesCount() {
    return +ConfigHelper.#readConfig().expectedSalesCount
  }

  static getPricePerSaleInSOL() {
    return +ConfigHelper.#readConfig().expectedSalesCount
  }

  /**
   *
   * @returns {String}
   */
  static getExpectedNFTsType() {
    return ConfigHelper.#readConfig().useNFTsThatAre
  }

  /**
   *
   * @returns {String}
   */
  static getAuthority() {
    return ConfigHelper.#readConfig().useNFTsThatAreHaveAuthority
  }

  static #readConfig() {
    return JSON.parse(fs.readFileSync(ConfigHelper.#configPath))
  }
}
