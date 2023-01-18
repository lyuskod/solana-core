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
