import * as dotenv from 'dotenv'
import { ErrorHelper } from './error-helper'
import fs from 'fs'
dotenv.config()

export class ConfigHelper {
  static #configPath = './config.json'
  constructor() {
    if (this instanceof ConfigHelper) {
      throw Error('A static class cannot be instantiated.')
    }
  }

  static getFeePayerPublicKey(){
    return ConfigHelper.#readConfig().feePayerPublicKey
  }

  static getFeePayerPrivateKey(){
    return ConfigHelper.#readConfig().feePayerPrivateKey
  }

  static getExpectedSalesCount(){
    return +(ConfigHelper.#readConfig().expectedSalesCount)
  }

  static getExpectedNFTsType(){
    return ConfigHelper.#readConfig().useNFTsThatAre
  }

  static #readConfig(){
    return JSON.parse(fs.readFileSync(ConfigHelper.#configPath))
  }
}
