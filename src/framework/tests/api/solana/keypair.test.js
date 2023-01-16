import { SolanaConnectionService } from '../../../api/solana/service.js'
import { EnvironmentHelper } from '../../../helpers/env-helper.js'
import { keyPairTestData } from './testdata/keypair-testdata.js'
import { expect, test } from '@jest/globals'
const solanaNetwork = EnvironmentHelper.getEnvValueByKey('JEST_SOLANA_NETWORK')
const service = new SolanaConnectionService(solanaNetwork).getKeyPairService()

test('Verify can encode String public key into Uint8Array', () => {
  const actualResult = service.encodeStrPKey(keyPairTestData.public.keyString)
  expect(actualResult).toEqual(
    Uint8Array.from(keyPairTestData.public.keyUInt8Array)
  )
})

test('Verify can encode String private key into Uint8Array', () => {
  const actualResult = service.encodeStrPKey(keyPairTestData.private.keyString)
  expect(actualResult).toEqual(
    Uint8Array.from(keyPairTestData.private.keyUInt8Array)
  )
})

test('Verify can decode public key from Uint8Array into String', () => {
  const actualResult = service.decodeUint8ArrayPKey(
    keyPairTestData.public.keyUInt8Array
  )
  expect(actualResult).toEqual(keyPairTestData.public.keyString)
})

test('Verify can decode private key from Uint8Array into String', () => {
  const actualResult = service.decodeUint8ArrayPKey(
    keyPairTestData.private.keyUInt8Array
  )
  expect(actualResult).toEqual(keyPairTestData.private.keyString)
})
