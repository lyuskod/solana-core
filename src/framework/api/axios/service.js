import axios from 'axios'

export class AxiosService {
  constructor() {
    if (this instanceof AxiosService) {
      throw Error('A static class cannot be instantiated.')
    }
  }

  /**
   * @description Send GET Axios request by params
   * @param {String} url - URL to call
   * @param {Object} params - Params in object-like instance (e.g. {name: 'Tom'})
   * @returns
   */
  static sendGet(url, params) {
    if (!(params == null || params == '' || params == {})) {
      url = `${url}?${this.#formatGetParamsIntoString(params)}`
    }

    return axios({
      method: 'get',
      url,
    })
  }

  /**
   * @description (Internal) Format params in object-like instance into String format (e.g. 'name=Tome&age=19')
   * @param {Object} params Params in object-like instance (e.g. {name: 'Tom'})
   * @returns
   */
  static #formatGetParamsIntoString(params) {
    if (!(params instanceof Object)) {
      throw new Error(
        'Params should be an object with KV-pairs: { name: value }'
      )
    }

    let keys = Object.keys(params)
    if (Object.keys.length == 0) {
      return ''
    }

    return keys.map((key) => `${key}=${params[key]}`).join('&')
  }
}
