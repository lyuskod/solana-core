import { SolanaConnectionService } from '../../../api/solana/service.js'
import { EnvironmentHelper } from '../../../helpers/env-helper.js'
import { expect, test } from '@jest/globals'
import { SolanaAccountService } from '../../../api/solana/account-service.js'
import { KeyPairService } from '../../../api/solana/keypair-service.js'
import { SolanaTransactionService } from '../../../api/solana/transaction-service.js'
const solanaNetwork = EnvironmentHelper.getEnvValueByKey('JEST_SOLANA_NETWORK')
const service = new SolanaConnectionService(solanaNetwork)

test('Verify Solana Connection Service returns Account service if requested', () => {
  const actualClass = service.getAccountService()
  expect(actualClass).toBeInstanceOf(SolanaAccountService)
  expect(actualClass).not.toBeNull()
})

test('Verify Solana Connection Service returns KeyPair service if requested', () => {
  const actualClass = service.getKeyPairService()
  expect(actualClass).toBeInstanceOf(KeyPairService)
  expect(actualClass).not.toBeNull()
})

test('Verify Solana Connection Service returns Transaction service if requested', () => {
  const actualClass = service.getTransactionService()
  expect(actualClass).toBeInstanceOf(SolanaTransactionService)
  expect(actualClass).not.toBeNull()
})
