import { expect, test } from '@jest/globals'
import { AxiosServiceHub } from '../src/services/axios/hub.js'

test('[Axios]: User cannot create an instance of AxiosServiceHub class', () => {
  try {
    new AxiosServiceHub()
  } catch (e) {
    expect(e.message).toMatch(
      `${AxiosServiceHub.name} static class cannot be instantiated.`
    )
  }
})

test('[Axios]: Verify GET-method returns 200 for valid endpoint', async () => {
  const url = 'https://httpbin.org/get'
  await AxiosServiceHub.sendGet(url).then((result) => {
    expect(result.status == 200)
  })
})

test('[Axios]: Verify GET-method returns 200 for valid endpoint sending with params', async () => {
  const url = 'https://httpbin.org/get'
  const params = {
    name: 'Test',
    age: 19,
  }
  await AxiosServiceHub.sendGet(url, params).then((result) => {
    expect(result.status == 200)
    expect(result.data.args === params)
  })
})

test('[Axios Service]: Verify GET-method returns 404 for invalid endpoint', async () => {
  const url = 'https://httpbininvalidiii.org/get'
  await AxiosServiceHub.sendGet(url).catch((result) => {
    expect(result.status == 404)
  })
})

const invalidUrls = [
  {
    type: 'url is null',
    value: null,
  },
  {
    type: 'url is empty',
    value: '',
  },
  {
    type: 'url is undefined',
    value: undefined,
  },
]
test.each(invalidUrls)(
  '[Axios]: Error is thrown if url is undefined/null/empty',
  async (data) => {
    try {
      await AxiosServiceHub.sendGet(data.value)
    } catch (e) {
      expect(e.message).toMatch(
        'Axios URL value cannot be null/undefined/empty'
      )
    }
  }
)
