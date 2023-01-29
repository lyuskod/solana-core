import axios from 'axios'
import { ErrorHelper } from '../../helpers/error.js'
import { Logger } from '../../tools/logger.js'

export class AxiosServiceHub {
  static #currentServiceName = 'Axios Service'
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

    Logger.ready(
      this.#currentServiceName,
      'Ready to send GET Axios request',
      url,
      Object.keys(params).length ? params : null
    )

    let response = await axios({
      method: 'get',
      url,
    })

    Logger.success(
      this.#currentServiceName,
      'Success to send GET Axios request',
      url,
      Object.keys(params).length ? params : null
    )

    return response
  }

  /**
   * @description - (Internal) Format params from object-like instance into String format (e.g. 'name=Tome&age=19')
   * @param {Object} - params Params in object-like instance (e.g. {name: 'Tom'})
   * @returns {String} - Returns params transformed into &name=Tom String
   */
  static #formatGetParamsIntoString(params) {
    const errorMessage =
      'Params should be an object with KV-pairs: { name: value }'
    if (!(params instanceof Object)) {
      Logger.error(ErrorHelper.name, errorMessage)
      throw new Error(errorMessage)
    }

    let keys = Object.keys(params)
    return keys.length == 0
      ? ''
      : keys.map((key) => `${key}=${params[key]}`).join('&')
  }
}
