import { expect, test } from '@jest/globals'
import { EnvironmentHelper } from '../helpers/env-helper.js'

test('[Environment Helper]: User can fetch an environment variable', () => {
  const expectedNetwork = 'devnet'
  const actualNetwork = EnvironmentHelper.getEnvValueByKey(
    'JEST_SOLANA_NETWORK'
  )
  expect(actualNetwork).toEqual(expectedNetwork)
})

test('[Environment Helper]: User receives undefined if there is no requested env var', () => {
  const invalidValue = EnvironmentHelper.getEnvValueByKey('INVALID')
  expect(invalidValue).toEqual(undefined)
})

test('[Environment Helper]: Error is thrown if user passes an empty key to fetch an env value', () => {
  try {
    EnvironmentHelper.getEnvValueByKey('')
    throw new Error(
      'Error was not thrown if user passes an empty key to fetch an env value'
    )
  } catch (e) {
    expect(e.message).toMatch('Value cannot be null/undefined/empty')
  }
})

test('[Environment Helper]: Error is thrown if user passes "null" as key to fetch an env value', () => {
  try {
    EnvironmentHelper.getEnvValueByKey(null)
    throw new Error(
      'Error was not thrown if user passes "null" as key to fetch an env value'
    )
  } catch (e) {
    expect(e.message).toMatch('Value cannot be null/undefined/empty')
  }
})

test('[Environment Helper]: Error is thrown if user passes undefined as key to fetch an env value', () => {
  try {
    EnvironmentHelper.getEnvValueByKey(undefined)
    throw new Error(
      'Error was not thrown if user passes undefined as key to fetch an env value'
    )
  } catch (e) {
    expect(e.message).toMatch('Value cannot be null/undefined/empty')
  }
})
