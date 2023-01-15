import axios from 'axios'

export class AxiosService {
    constructor() {
        if (this instanceof AxiosService) {
            throw Error('A static class cannot be instantiated.')
        }
    }

    static sendGet(url, params, callback) {
        if (!(params == null || params == '')) {
            url = `${url}?${this.#formatGetParamsIntoString(params)}`
        }

        axios({
            method: 'get',
            url,
        }).then((response) => {
            callback(response)
        })
    }

    static #formatGetParamsIntoString(params) {
        if (!(params instanceof Object)) {
            throw new Exception(
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
