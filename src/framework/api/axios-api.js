import axios from 'axios'

export class AxiosService {
    constructor() {
        if (this instanceof AxiosService) {
            throw Error('A static class cannot be instantiated.')
        }
    }

    static sendGet(url, params) {
        if (!(params == null || params == '')) {
            url = `${url}?${this.#formatGetParamsIntoString(params)}`
        }

        return axios({
            method: 'get',
            url,
        })
    }

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
