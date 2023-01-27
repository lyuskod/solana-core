import { expect, test } from '@jest/globals'
import { ErrorHelper } from '../src/helpers/error.js'

const validUrlTestData = [
  {
    type: 'https',
    value: 'https://website.com',
  },
  {
    type: 'http',
    value: 'http://website.com',
  },
]
test.each(validUrlTestData)(
  '[Error]: Error is not thrown is value is url',
  (data) => {
    ErrorHelper.throwErrorIfValueIsNotURL(data.value, data.type)
  }
)

const validNegativeTestData = [
  {
    type: '1',
    value: 1,
  },
  {
    type: '0',
    value: 0,
  },
  {
    type: '1000',
    value: 1000,
  },
]
test.each(validNegativeTestData)(
  '[Error]: Error is not thrown if value is not negative',
  (data) => {
    ErrorHelper.throwErrorIfValueIsNegative(data.value, data.type)
  }
)

const valueValidData = [
  {
    type: 'number',
    value: 1,
  },
  {
    type: 'string',
    value: 'some string',
  },
  {
    type: 'boolean false',
    value: false,
  },
  {
    type: 'object',
    value: { age: 20 },
  },
  {
    type: 'zero',
    value: 0,
  },
]
test.each(valueValidData)(
  '[Error]: Error is not thrown if value is not undefined/null/empty',
  (data) => {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(data.value, data.type)
  }
)

const validArrayTestData = [
  {
    type: 'array has 1 element [number]',
    value: [1],
  },
  {
    type: 'array has 1 element [object]',
    value: [{ age: 20 }],
  },
  {
    type: 'array has 1 element [empty object]',
    value: [{}],
  },
]
test.each(validArrayTestData)(
  '[Error]: Value is not thrown if array is not null/undefined/empty',
  (data) => {
    ErrorHelper.throwErrorIfArrayIsEmptyOrNullOrUndefined(data.value, data.type)
  }
)

test('[Error]: User cannot create an instance of ErrorHelper class', () => {
  try {
    new ErrorHelper()
  } catch (e) {
    expect(e.message).toMatch(
      `${ErrorHelper.name} static class cannot be instantiated.`
    )
  }
})
const valueErrorTestData = [
  {
    type: 'null',
    value: null,
  },
  {
    type: 'undefined',
    value: undefined,
  },
  {
    type: 'empty',
    value: '',
  },
]
test.each(valueErrorTestData)(
  '[Error]: Error is thrown if value is null/undefined/empty',
  (data) => {
    try {
      ErrorHelper.throwErrorIfUndefinedNullOrEmpty(data.value, data.type)
    } catch (e) {
      expect(e.message).toMatch(
        `${data.type} value cannot be null/undefined/empty`
      )
    }
  }
)

const arrayErrorTestData = [
  {
    type: 'empty array',
    value: [],
  },
  {
    type: 'null array',
    value: null,
  },
  {
    type: 'undefined array',
    value: undefined,
  },
]
test.each(arrayErrorTestData)(
  '[Error]: Error is thrown if array is empty/null/undefined',
  (data) => {
    try {
      ErrorHelper.throwErrorIfArrayIsEmptyOrNullOrUndefined(
        data.value,
        data.type
      )
    } catch (e) {
      expect(e.message).toMatch(
        `${data.type} array cannot be null/empty/undefined or have size equal to 0`
      )
    }
  }
)

const negativeValueTestData = [
  {
    type: '-1',
    value: -1,
  },
  {
    type: '-0',
    value: -0,
  },
  {
    type: '-0.99',
    value: -0.99,
  },
]
test.each(negativeValueTestData)(
  '[Error]: Error is thrown if value is negative',
  (data) => {
    try {
      ErrorHelper.throwErrorIfValueIsNegative(data.value, data.type)
    } catch (e) {
      expect(e.message).toMatch(`${data.type} value cannot be negative`)
    }
  }
)

const urlTestData = [
  {
    type: 'without protocol',
    value: 'domain.com',
  },
  {
    type: 'just domain',
    value: '.com',
  },
  {
    type: 'wording',
    value: 'domain',
  },
]
test.each(urlTestData)(
  '[Error]: Error is thrown if value is not in url format',
  (data) => {
    try {
      ErrorHelper.throwErrorIfValueIsNotURL(data.value, data.type)
    } catch (e) {
      expect(e.message).toMatch(
        `${data.type} value is not in url format. Provided value is: ${data.value}`
      )
    }
  }
)
