import { expect, test } from '@jest/globals'
import { AxiosService } from '../../services/axios/service.js'
const testData = {
  valid: {
    endpoint: 'https://httpbin.org/get',
    params: {
      name: 'Test',
      age: 19,
    },
  },
  invalid: {
    endpoint: 'https://httpbininvalidiii.org/get',
  },
}

test('[Axios Service]: Verify GET-method returns 200 for valid endpoint', () => {
  AxiosService.sendGet(testData.valid.endpoint).then((result) => {
    expect(result.status == 200)
  })
})

test('[Axios Service]: Verify GET-method returns 200 for valid endpoint sending with params', () => {
  AxiosService.sendGet(testData.valid.endpoint, testData.valid.params).then(
    (result) => {
      expect(result.status == 200)
      expect(result.data.args === testData.valid.params)
    }
  )
})

test('[Axios Service]: Verify GET-method returns 404 for invalid endpoint', () => {
  AxiosService.sendGet(testData.invalid.endpoint).catch((result) => {
    expect(result.status == 404)
  })
})

test('[Axios Service]: Verify GET-method returns 404 if url is empty', () => {
  AxiosService.sendGet('').catch((result) => {
    expect(result.status == 404)
  })
})

test('[Axios Service]: Verify GET-method returns 404 if url is null', () => {
  AxiosService.sendGet(null).catch((result) => {
    expect(result.status == 404)
  })
})

test('[Axios Service]: Verify GET-method returns 404 if url is undefined', () => {
  AxiosService.sendGet(undefined).catch((result) => {
    expect(result.status == 404)
  })
})
