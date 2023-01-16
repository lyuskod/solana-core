import { SolanaConnectionService } from '../../../api/solana/service.js'
import { EnvironmentHelper } from '../../../helpers/env-helper.js'
import { accountTestData } from '../solana/testdata/account-testdata.js'
import { expect, test } from '@jest/globals'
import { PublicKey } from '@solana/web3.js'
const solanaNetwork = EnvironmentHelper.getEnvValueByKey('JEST_SOLANA_NETWORK')
const service = new SolanaConnectionService(solanaNetwork).getAccountService()

test('Verify get solana account balance returns valid balance', async () => {
  const actualBalance = await service.getBalance(
    accountTestData.validAccount.publicKey
  )
  const expectedBalance = accountTestData.validAccount.balance
  expect(actualBalance).not.toBeNull()
  expect(actualBalance).toEqual(expectedBalance)
})

// BUG: https://lyuskodm.atlassian.net/browse/NSS-1
test.skip('Verify an error throws if account does not exists in blockchain while getting balance', async () => {
  const actualBalance = service.getBalance(
    accountTestData.invalidAccount.publicKey
  )
})

test('Verify get solana account balance throws an error when public key is an empty string', async () => {
  try {
    await service.getBalance('')
    throw new Error('Get balance didnt throw an error when invalid public key')
  } catch (e) {
    expect(e.message).toMatch('Invalid public key input')
  }
})

test('Verify get solana account balance throws an error when public key is null', async () => {
  try {
    await service.getBalance(null)
    throw new Error('Get balance didnt throw an error when invalid public key')
  } catch (e) {
    expect(e.message).toMatch("Cannot read properties of null (reading '_bn')")
  }
})

test('Verify get solana account balance throws an error when public key is undefined', async () => {
  try {
    await service.getBalance(null)
    throw new Error('Get balance didnt throw an error when invalid public key')
  } catch (e) {
    expect(e.message).toMatch("Cannot read properties of null (reading '_bn')")
  }
})

test('Verify get solana account info returns valid output', async () => {
  const actualAccountInfo = await service.getAccountInfo(
    accountTestData.validAccount.publicKey
  )
  expect(actualAccountInfo).not.toBeNull()
  expect(actualAccountInfo.owner).toBeInstanceOf(PublicKey)
})
