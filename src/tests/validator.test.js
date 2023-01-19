import { expect, test } from '@jest/globals'
import { SolanaValidatorService } from '../api/solana/validator-service.js'

test('[Validator]: Error is not thrown if main network is valid', () => {
  SolanaValidatorService.validateMainNetwork('mainnet-beta')
})

test('[Validator]: Error is thrown if main network is invalid', () => {
  try {
    SolanaValidatorService.validateMainNetwork('invalidnetwork')
    throw new Error('Error was not thrown if main network is invalid')
  } catch (e) {
    expect(e.message).toMatch(
      "'invalidnetwork' is not a production network. Available production networks are: [mainnet-beta]"
    )
  }
})

test('[Validator]: Error is thrown if main network is an empty value', () => {
  try {
    SolanaValidatorService.validateMainNetwork('')
    throw new Error('Error was not thrown if main network is an empty value')
  } catch (e) {
    expect(e.message).toMatch(
      "'' is not a production network. Available production networks are: [mainnet-beta]"
    )
  }
})

test('[Validator]: Error is thrown if main network is null', () => {
  try {
    SolanaValidatorService.validateMainNetwork(null)
    throw new Error('Error was not thrown if main network is null')
  } catch (e) {
    expect(e.message).toMatch(
      "'null' is not a production network. Available production networks are: [mainnet-beta]"
    )
  }
})

test('[Validator]: Error is thrown if main network is undefined', () => {
  try {
    SolanaValidatorService.validateMainNetwork(null)
    throw new Error('Error was not thrown if main network is undefined')
  } catch (e) {
    expect(e.message).toMatch(
      "'null' is not a production network. Available production networks are: [mainnet-beta]"
    )
  }
})

test('[Validator]: Error is not thrown if test network is devnet', () => {
  SolanaValidatorService.validateTestNetwork('devnet')
})

test('[Validator]: Error is not thrown if test network is testnet', () => {
  SolanaValidatorService.validateTestNetwork('testnet')
})

test('[Validator]: Error is thrown if test network is invalid', () => {
  try {
    SolanaValidatorService.validateTestNetwork('mainnet-beta')
    throw new Error('Error was not thrown if test network is mainnet-beta')
  } catch (e) {
    expect(e.message).toMatch(
      "'mainnet-beta' is not a test network. Available test networks are: [devnet,testnet]"
    )
  }
})

test('[Validator]: Error is thrown if test network is an empty value', () => {
  try {
    SolanaValidatorService.validateTestNetwork('')
    throw new Error('Error was not thrown if test network is an empty value')
  } catch (e) {
    expect(e.message).toMatch(
      "'' is not a test network. Available test networks are: [devnet,testnet]"
    )
  }
})

test('[Validator]: Error is thrown if test network is null', () => {
  try {
    SolanaValidatorService.validateTestNetwork(null)
    throw new Error('Error was not thrown if test network is null')
  } catch (e) {
    expect(e.message).toMatch(
      "'null' is not a test network. Available test networks are: [devnet,testnet]"
    )
  }
})

test('[Validator]: Error is thrown if test network is undefined', () => {
  try {
    SolanaValidatorService.validateTestNetwork(null)
    throw new Error('Error was not thrown if test network is undefined')
  } catch (e) {
    expect(e.message).toMatch(
      "'null' is not a test network. Available test networks are: [devnet,testnet]"
    )
  }
})

test('[Validator]: Error is not thrown if network is valid', () => {
  SolanaValidatorService.validateNetwork('mainnet-beta')
  SolanaValidatorService.validateNetwork('devnet')
  SolanaValidatorService.validateNetwork('testnet')
})

test('[Validator]: Error is thrown if network is an empty', () => {
  try {
    SolanaValidatorService.validateNetwork('')
    throw new Error('Error was not thrown if network is empty')
  } catch (e) {
    expect(e.message).toMatch(
      "'' is not a valid network. Available networks are: [devnet,testnet,mainnet-beta]"
    )
  }
})

test('[Validator]: Error is thrown if network is null', () => {
  try {
    SolanaValidatorService.validateNetwork(null)
    throw new Error('Error was not thrown if network is null')
  } catch (e) {
    expect(e.message).toMatch(
      "'null' is not a valid network. Available networks are: [devnet,testnet,mainnet-beta]"
    )
  }
})

test('[Validator]: Error is thrown if network is undefined', () => {
  try {
    SolanaValidatorService.validateNetwork(undefined)
    throw new Error('Error was not thrown if network is undefined')
  } catch (e) {
    expect(e.message).toMatch(
      "'undefined' is not a valid network. Available networks are: [devnet,testnet,mainnet-beta]"
    )
  }
})

test('[Validator]: Error is thrown if network is invalid', () => {
  try {
    SolanaValidatorService.validateNetwork('invalidnetwork')
    throw new Error('Error was not thrown if network is invalid')
  } catch (e) {
    expect(e.message).toMatch(
      "'invalidnetwork' is not a valid network. Available networks are: [devnet,testnet,mainnet-beta]"
    )
  }
})
