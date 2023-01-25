import { expect, test } from '@jest/globals'
import { MagicEdenCollectionService } from '../../services/me/collection.js'
const testData = {
  valid: {
    apiUrlHttps: 'https://api-mainnet.magiceden.dev/v2',
    apiUrlHttp: 'http://api-mainnet.magiceden.dev/v2',
    collectionSymbol: 'duc',
  },
  invalid: {
    apiUrl: 'api-mainnet',
  },
}

test('[ME Collection]: User can create collection instance with valid url', () => {
  new MagicEdenCollectionService(testData.valid.apiUrlHttps)
  new MagicEdenCollectionService(testData.valid.apiUrlHttp)
})

test('[ME Collection]: User cant create collection instance with invalid url', () => {
  try {
    new MagicEdenCollectionService(testData.invalid.apiUrl)
  } catch (e) {
    expect(e.message).toMatch(
      `value is not in url format. Provided value is: ${testData.invalid.apiUrl}`
    )
  }
})

test('[ME Collection]: User cant create collection instance if url is null', () => {
  try {
    new MagicEdenCollectionService(null)
  } catch (e) {
    expect(e.message).toMatch('value cannot be null/undefined/empty')
  }
})

test('[ME Collection]: User cant create collection instance if url is empty', () => {
  try {
    new MagicEdenCollectionService('')
  } catch (e) {
    expect(e.message).toMatch('value cannot be null/undefined/empty')
  }
})

test('[ME Collection]: User cant create collection instance if url is undefined', () => {
  try {
    new MagicEdenCollectionService(undefined)
  } catch (e) {
    expect(e.message).toMatch('value cannot be null/undefined/empty')
  }
})

test('[ME Collection]: User can retrieve collection info by collection symbol', async () => {
  const collectionInfo = await new MagicEdenCollectionService(
    testData.valid.apiUrlHttps
  ).getCollectionInfoByCollectionSymbol(testData.valid.collectionSymbol)
  expect(collectionInfo).not.toBe(null)
  expect(collectionInfo.symbol).toEqual(testData.valid.collectionSymbol)
})

//TODO collection test with invalid collection symbol