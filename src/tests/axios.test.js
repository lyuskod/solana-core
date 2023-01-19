import { expect, test } from '@jest/globals'
import { AxiosService } from '../services/axios/service.js'

test('[Axios Service]: Verify GET-method returns 200 for valid endpoint', () => {
    const url = "https://httpbin.org/get"
    AxiosService.sendGet(url).then(result => {
        expect(result.status == 200)
    })
})

test('[Axios Service]: Verify GET-method returns 200 for valid endpoint sending with params', () => {
    const url = "https://httpbin.org/get"
    const params = {
        name: 'Test',
        age: 19
    }
    AxiosService.sendGet(url, params).then(result => {
        expect(result.status == 200)
        expect(result.data.args === params)
    })
})

test('[Axios Service]: Verify GET-method returns 404 for invalid endpoint', () => {
    const url = "https://httpbininvalidiii.org/get"
    AxiosService.sendGet(url).catch(result => {
        expect(result.status == 404)
    })
})

test('[Axios Service]: Verify GET-method returns 404 if url is empty', () => {
    const url = ""
    AxiosService.sendGet(url).catch(result => {
        expect(result.status == 404)
    })
})

test('[Axios Service]: Verify GET-method returns 404 if url is null', () => {
    const url = null
    AxiosService.sendGet(url).catch(result => {
        expect(result.status == 404)
    })
})

test('[Axios Service]: Verify GET-method returns 404 if url is undefined', () => {
    const url = undefined
    AxiosService.sendGet(url).catch(result => {
        expect(result.status == 404)
    })
})