import { expect, test } from '@jest/globals'
import { ErrorHelper } from '../../helpers/error-helper.js'
const testData = {
  valid: {
    expectedArrayErrorMessage:
      'array cannot be null/empty/undefined or have size equal to 0',
    expectedValueErrorMessage: 'value cannot be null/undefined/empty',
  },
}

test('[Error Helper]: Error is not thrown if value is not empty', () => {
  ErrorHelper.throwErrorIfUndefinedNullOrEmpty('test')
  ErrorHelper.throwErrorIfUndefinedNullOrEmpty(3)
  ErrorHelper.throwErrorIfUndefinedNullOrEmpty({})
  ErrorHelper.throwErrorIfUndefinedNullOrEmpty({
    name: 'Test',
  })
})

test('[Error Helper]: Error is not thrown if array is not empty', () => {
  ErrorHelper.throwErrorIfArrayIsEmptyOrNull([0])
  ErrorHelper.throwErrorIfArrayIsEmptyOrNull([0, 1])
})

test('[Error Helper]: Error is not thrown if value is in url format', () => {
  ErrorHelper.throwErrorIfValueIsNotURL('https://valid.com')
  ErrorHelper.throwErrorIfValueIsNotURL('http://valid.com')
})

test('[Error Helper]: User cannot create instance of class', () => {
  try {
    new ErrorHelper()
  } catch (e) {
    expect(e.message).toMatch(
      'ErrorHelper static class cannot be instantiated.'
    )
  }
})

test('[Error Helper]: Error is thrown if value is empty', () => {
  try {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty('')
  } catch (e) {
    expect(e.message).toMatch(testData.valid.expectedValueErrorMessage)
  }
})

test('[Error Helper]: Error is thrown if value is null', () => {
  try {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(null)
  } catch (e) {
    expect(e.message).toMatch(testData.valid.expectedValueErrorMessage)
  }
})

test('[Error Helper]: Error is thrown if value is undefined', () => {
  try {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(undefined)
  } catch (e) {
    expect(e.message).toMatch(testData.valid.expectedValueErrorMessage)
  }
})

test('[Error Helper]: Error is thrown if value is empty having value name in error message', () => {
  try {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(undefined, 'Public Key')
  } catch (e) {
    expect(e.message).toMatch(
      `Public Key ${testData.valid.expectedValueErrorMessage}`
    )
  }
})

test('[Error Helper]: Error is thrown if array is empty', () => {
  try {
    ErrorHelper.throwErrorIfArrayIsEmptyOrNull([])
  } catch (e) {
    expect(e.message).toMatch(testData.valid.expectedArrayErrorMessage)
  }
})

test('[Error Helper]: Error is thrown if array is null', () => {
  try {
    let nullArray = []
    nullArray = null
    ErrorHelper.throwErrorIfArrayIsEmptyOrNull(nullArray)
  } catch (e) {
    expect(e.message).toMatch(testData.valid.expectedArrayErrorMessage)
  }
})

test('[Error Helper]: Error is thrown if array is undefined', () => {
  try {
    let undefinedArray = []
    undefinedArray = undefined
    ErrorHelper.throwErrorIfArrayIsEmptyOrNull(undefinedArray)
  } catch (e) {
    expect(e.message).toMatch(testData.valid.expectedArrayErrorMessage)
  }
})

test('[Error Helper]: Error is thrown if array size is 0', () => {
  try {
    let undefinedArray = []
    undefinedArray = undefined
    ErrorHelper.throwErrorIfArrayIsEmptyOrNull(undefinedArray)
  } catch (e) {
    expect(e.message).toMatch(testData.valid.expectedArrayErrorMessage)
  }
})

test('[Error Helper]: Error is thrown if array size is 0 having array name in error message', () => {
  try {
    ErrorHelper.throwErrorIfArrayIsEmptyOrNull([], 'NFTs Array')
  } catch (e) {
    expect(e.message).toMatch(
      `NFTs Array ${testData.valid.expectedArrayErrorMessage}`
    )
  }
})

test('[Error Helper]: Error is thrown if value is not in url format', () => {
  const invalidFormatValue = 'hello'
  try {
    ErrorHelper.throwErrorIfValueIsNotURL(invalidFormatValue)
  } catch (e) {
    expect(e.message).toMatch(
      `value is not in url format. Provided value is: ${invalidFormatValue}`
    )
  }
})

test('[Error Helper]: Error is thrown if value is not in url format but null', () => {
  try {
    ErrorHelper.throwErrorIfValueIsNotURL(null)
  } catch (e) {
    expect(e.message).toMatch(testData.valid.expectedValueErrorMessage)
  }
})

test('[Error Helper]: Error is thrown if value is not in url format but undefined', () => {
  try {
    ErrorHelper.throwErrorIfValueIsNotURL(undefined)
  } catch (e) {
    expect(e.message).toMatch(testData.valid.expectedValueErrorMessage)
  }
})

test('[Error Helper]: Error is thrown if value is not in url format but empty', () => {
  try {
    ErrorHelper.throwErrorIfValueIsNotURL('')
  } catch (e) {
    expect(e.message).toMatch(testData.valid.expectedValueErrorMessage)
  }
})
