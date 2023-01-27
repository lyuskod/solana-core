import axios from 'axios'
import { ErrorHelper } from '../../helpers/error.js'
import { Logger } from '../../tools/logger.js'

export class AxiosServiceHub {
  static #currentServiceName = 'Axios'
  constructor() {
    if (this instanceof AxiosServiceHub) {
      const errorMessage = `${AxiosServiceHub.name} static class cannot be instantiated.`
      Logger.error(AxiosServiceHub.name, errorMessage)
      throw Error(errorMessage)
    }
  }

  /**
   * @description Send GET Axios request by params
   * @param {String} url - URL to call
   * @param {Object} params - Params in object-like instance (e.g. {name: 'Tom'})
   * @returns {Promise<AxiosResponse<any, any>>}
   */
  static async sendGet(url, params = {}) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(url, 'Axios URL')
    if (
      !(params == null || params == undefined || params == '' || params == {})
    ) {
      url = `${url}?${this.#formatGetParamsIntoString(params)}`
    }

    Logger.silly(
      this.#currentServiceName,
      '[READY] Send GET Axios request',
      url,
      Object.keys(params).length ? params : null
    )

    return await axios({
      method: 'get',
      url,
    })
  }

  /**
   * @description (Internal) Format params from object-like instance into String format (e.g. 'name=Tome&age=19')
   * @param {Object} params Params in object-like instance (e.g. {name: 'Tom'})
   * @returns {Array<String>}
   */
  static #formatGetParamsIntoString(params) {
    if (!(params instanceof Object)) {
      throw new Error(
        'Params should be an object with KV-pairs: { name: value }'
      )
    }

    let keys = Object.keys(params)
    return keys.length == 0
      ? ''
      : keys.map((key) => `${key}=${params[key]}`).join('&')
  }
}
