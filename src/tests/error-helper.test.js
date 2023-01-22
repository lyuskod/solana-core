import { expect, test } from '@jest/globals'
import { ErrorHelper } from '../helpers/error-helper.js'

test('[Error Helper]: Error is not thrown value is not empty', () => {
  ErrorHelper.throwErrorIfUndefinedNullOrEmpty('test')
  ErrorHelper.throwErrorIfUndefinedNullOrEmpty(3)
  ErrorHelper.throwErrorIfUndefinedNullOrEmpty({})
  ErrorHelper.throwErrorIfUndefinedNullOrEmpty({
    name: 'Test',
  })
})

test('[Error Helper]: Error is thrown if value is empty', () => {
  try {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty('')
    throw new Error('Error was not thrown if value is empty')
  } catch (e) {
    expect(e.message).toMatch('Value cannot be null/undefined/empty')
  }
})

test('[Error Helper]: Error is thrown if value is null', () => {
  try {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(null)
    throw new Error('Error was not thrown if value is null')
  } catch (e) {
    expect(e.message).toMatch('Value cannot be null/undefined/empty')
  }
})

test('[Error Helper]: Error is thrown if value is undefined', () => {
  try {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(undefined)
    throw new Error('Error was not thrown if value is undefined')
  } catch (e) {
    expect(e.message).toMatch('Value cannot be null/undefined/empty')
  }
})
