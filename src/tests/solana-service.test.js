import { expect, test } from '@jest/globals'
import { SolanaAccountService } from '../services/solana/account-service.js'
import { SolanaConnectionService } from '../services/solana/service.js'
import { SolanaKeyPairService } from '../services/solana/keypair-service.js'
import { SolanaTransactionService } from '../services/solana/transaction-service.js'

test('[Solana mainnet-beta Service]: Verify user can create solana service instance if network is main', () => {
  new SolanaConnectionService('mainnet-beta')
})

test('[Solana mainnet-beta Service]: Verify user can create multiple solana service instances if network is main', () => {
  new SolanaConnectionService('mainnet-beta')
})

test('Solana mainnet-beta Service]: Verify user cant create solana service instance if network is devnet', () => {
  try {
    new SolanaConnectionService('devnet')
    throw new Error(
      'Error was not thrown if user creates solana instance with devnet network'
    )
  } catch (e) {
    expect(e.message).toMatch(
      "'devnet' is not a production network. Available production networks are: [mainnet-beta]"
    )
  }
})

test('Solana mainnet-beta Service]: Verify user cant create solana service instance if network is testnet', () => {
  try {
    new SolanaConnectionService('testnet')
    throw new Error(
      'Error was not thrown if user creates solana instance with testnet network'
    )
  } catch (e) {
    expect(e.message).toMatch(
      "'testnet' is not a production network. Available production networks are: [mainnet-beta]"
    )
  }
})

test('Solana mainnet-beta Service]: Verify user cant create solana service instance if network is invalid', () => {
  try {
    new SolanaConnectionService('invalidnetworktest')
    throw new Error(
      'Error was not thrown if user creates solana instance with invalid network'
    )
  } catch (e) {
    expect(e.message).toMatch(
      "'invalidnetworktest' is not a production network. Available production networks are: [mainnet-beta]"
    )
  }
})

test('Solana mainnet-beta Service]: Verify user cant create solana service instance if network is empty', () => {
  try {
    new SolanaConnectionService('')
    throw new Error(
      'Error was not thrown if user creates solana instance with by providing an empty network'
    )
  } catch (e) {
    expect(e.message).toMatch('Value cannot be null/undefined/empty')
  }
})

test('Solana mainnet-beta Service]: Verify user cant create solana service instance if network is null', () => {
  try {
    new SolanaConnectionService('')
    throw new Error(
      'Error was not thrown if user creates solana instance with by providing network value as null'
    )
  } catch (e) {
    expect(e.message).toMatch('Value cannot be null/undefined/empty')
  }
})

test('Solana mainnet-beta Service]: Verify user cant create solana service instance if network is undefined', () => {
  try {
    new SolanaConnectionService('')
    throw new Error(
      'Error was not thrown if user creates solana instance with by providing network value as undefined'
    )
  } catch (e) {
    expect(e.message).toMatch('Value cannot be null/undefined/empty')
  }
})

test('[Solana mainnet-beta Service]: Verify user can retrieve an account service and account service instance is not null', () => {
  const accountService = new SolanaConnectionService(
    'mainnet-beta'
  ).getAccountService()
  expect(accountService).toBeInstanceOf(SolanaAccountService)
  expect(accountService).not.toBe(null)
})

test('[Solana mainnet-beta Service]: Verify user can retrieve keypair service and keypair service instance is not null', () => {
  const keypairService = new SolanaConnectionService(
    'mainnet-beta'
  ).getKeyPairService()
  expect(keypairService).toBeInstanceOf(SolanaKeyPairService)
  expect(keypairService).not.toBe(null)
})

test('[Solana mainnet-beta Service]: Verify user can retrieve transaction service and transaction service instance is not null', () => {
  const transactionService = new SolanaConnectionService(
    'mainnet-beta'
  ).getTransactionService()
  expect(transactionService).toBeInstanceOf(SolanaTransactionService)
  expect(transactionService).not.toBe(null)
})
