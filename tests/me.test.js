import { expect, test } from '@jest/globals'
import { MagicEdenCollectionService } from '../src/services/me/collection.js'
import { MagicEdenServiceHub } from '../src/services/me/hub.js'
import { MagicEdenNFTService } from '../src/services/me/nft.js'
import { MagicEdenWalletService } from '../src/services/me/wallet.js'

const collectionService = new MagicEdenCollectionService(
  'https://api-mainnet.magiceden.dev/v2'
)
const hubService = new MagicEdenServiceHub(
  'https://api-mainnet.magiceden.dev/v2'
)

const validApiUrls = [
  {
    type: 'https',
    value: 'https://api.com/v2',
  },
  {
    type: 'http',
    value: 'https://api.com/v2',
  },
]
test.each(validApiUrls)(
  '[ME Collection]: Error is not thrown if api url is in url format',
  (data) => {
    new MagicEdenCollectionService(data.value)
  }
)

const invalidUrls = [
  {
    type: 'without protocol',
    value: 'domain.com',
  },
  {
    type: 'just domain',
    value: '.com',
  },
  {
    type: 'wording',
    value: 'domain',
  },
]
test.each(invalidUrls)(
  '[ME Collection]: Error is thrown if url is not in url format',
  (data) => {
    try {
      new MagicEdenCollectionService(data.value, data.type)
    } catch (e) {
      expect(e.message).toMatch(
        `ME Collection API Url value is not in url format. Provided value is: ${data.value}`
      )
    }
  }
)

const valueErrorTestData = [
  {
    type: 'null',
    value: null,
  },
  {
    type: 'undefined',
    value: undefined,
  },
]
test.each(valueErrorTestData)(
  '[ME Collection]: Error is thrown if collection api url is undefined/null/empty',
  (data) => {
    try {
      new MagicEdenCollectionService(data.value)
    } catch (e) {
      expect(e.message).toMatch(
        'ME Collection API Url value cannot be null/undefined/empty'
      )
    }
  }
)

test('[ME Collection]: User can get the collection info by valid collection symbol', async () => {
  const response = await collectionService.getCollectionInfoByCollectionSymbol(
    'duc'
  )
  expect(response).not.toBe(null)
  expect(response.symbol).toMatch('duc')
  expect(response.name).toMatch('Solana Darknet Users Club')
})

test('[ME Collection]: User gets 404 if collection symbol is invalid', async () => {
  try {
    await collectionService.getCollectionInfoByCollectionSymbol('duc123')
  } catch (e) {
    expect(e.message).toMatch(
      `Get Collection info by collection symbol Request failed with status code 404`
    )
  }
})

test('[ME Collection]: User can get the collection stats by the valid collection symbol', async () => {
  const collectionStats =
    await collectionService.getCollectionStatsByCollectionSymbol('duc')
  expect(collectionStats).not.toBe(null)
  expect(collectionStats.symbol).toEqual('duc')
})

test('[ME Collection]: User receives an object when calling the get the collection stats by the invalid collection symbol', async () => {
  const collectionStats =
    await collectionService.getCollectionStatsByCollectionSymbol('d1u2c3')
  expect(collectionStats).not.toBe(null)
})

test.each(valueErrorTestData)(
  '[ME Collection]: User receives an error calling get collection stats if symbol is null/undefined/empty',
  async (data) => {
    try {
      await collectionService.getCollectionStatsByCollectionSymbol(
        data.value,
        data.type
      )
    } catch (e) {
      expect(e.message).toMatch(
        'Collection Symbol value cannot be null/undefined/empty'
      )
    }
  }
)

test('[ME Collection]: User can get the ME collection activities by valid collection symbol', async () => {
  const collectionActivities =
    await collectionService.getCollectionActivitiesByCollectionSymbol('duc')
  expect(collectionActivities).not.toBe(null)
  expect(collectionActivities[0].collectionSymbol).toEqual('duc')
})

test('[ME Collection]: User recieves an empty array when calling ME collection activities by invalid collection symbol', async () => {
  const collectionActivities =
    await collectionService.getCollectionActivitiesByCollectionSymbol('d1u2c3')
  expect(collectionActivities).not.toBe(null)
  expect(collectionActivities).toEqual([])
})

test('[ME Collection]: User recieves 100 activities by default when calling ME collection activities', async () => {
  const collectionActivities =
    await collectionService.getCollectionActivitiesByCollectionSymbol('duc')
  expect(collectionActivities.length).toEqual(100)
})

const expectedLimits = [
  {
    type: '99',
    value: 99,
  },
  {
    type: '1',
    value: 1,
  },
  {
    type: '50',
    value: 50,
  },
]
test.each(expectedLimits)(
  '[ME Collection]: User recieves activities by limit if requests it when calling ME collection activities',
  async (data) => {
    const collectionActivities =
      await collectionService.getCollectionActivitiesByCollectionSymbol('duc', {
        offset: 0,
        limit: data.value,
      })
    expect(collectionActivities.length).toEqual(data.value)
  }
)

test('[ME Collection]: User can use offset to fetch the collection activities', async () => {
  const allActivities =
    await collectionService.getCollectionActivitiesByCollectionSymbol('duc', {
      offset: 0,
      limit: 2,
    })
  const offseted1 =
    await collectionService.getCollectionActivitiesByCollectionSymbol('duc', {
      offset: 1,
      limit: 2,
    })
  const missedActivityObject = allActivities[0]
  expect(offseted1).toHaveLength(2)
  expect(!offseted1.includes(missedActivityObject)).toBe(true)
})

test('[ME Collection]: Users receives an error if offset value is negative when fetching the collection activities', async () => {
  try {
    await collectionService.getCollectionActivitiesByCollectionSymbol('duc', {
      offset: -1,
      limit: 1,
    })
  } catch (e) {
    expect(e.message).toMatch(
      'Get collection activities: Offset value cannot be negative'
    )
  }
})

test('[ME Collection]: Users receives an error if limit value is negative when fetching the collection activities', async () => {
  try {
    await collectionService.getCollectionActivitiesByCollectionSymbol('duc', {
      offset: 0,
      limit: -1,
    })
  } catch (e) {
    expect(e.message).toMatch(
      'Get collection activities: Limit value cannot be negative'
    )
  }
})

test.each(valueErrorTestData)(
  '[ME Collection]: Users receives an error if offset value is null/empty/undefined when calling get collection activities',
  async (data) => {
    try {
      await collectionService.getCollectionActivitiesByCollectionSymbol('duc', {
        offset: data.value,
        limit: 1,
      })
    } catch (e) {
      expect(e.message).toMatch(
        'Get collection activities: Offset value cannot be null/undefined'
      )
    }
  }
)

test.each(valueErrorTestData)(
  '[ME Collection]: Users receives an error if limit value is null/empty/undefined when calling get collection activities',
  async (data) => {
    try {
      await collectionService.getCollectionActivitiesByCollectionSymbol('duc', {
        offset: 1,
        limit: data.value,
      })
    } catch (e) {
      expect(e.message).toMatch(
        'Get collection activities: Limit value cannot be null/undefined'
      )
    }
  }
)

test.each(valueErrorTestData)(
  '[ME Collection]: User receives an error calling get collection activities if symbol is null/undefined/empty',
  async (data) => {
    try {
      await collectionService.getCollectionActivitiesByCollectionSymbol(
        data.value
      )
    } catch (e) {
      expect(e.message).toMatch(
        'Collection Symbol value cannot be null/undefined/empty'
      )
    }
  }
)

test.each(valueErrorTestData)(
  '[ME Hub]: Error is thrown when user is trying to create a ME Hub instance if url is null/empty/undefined',
  (data) => {
    try {
      new MagicEdenServiceHub(data.value, data.type)
    } catch (e) {
      expect(e.message).toMatch(
        'ME Hub API Url value cannot be null/undefined/empty'
      )
    }
  }
)

test.each(invalidUrls)(
  '[ME Hub]: Error is thrown when user is trying to create a ME Hub instance if url is not in url format',
  (data) => {
    try {
      new MagicEdenServiceHub(data.value, data.type)
    } catch (e) {
      expect(e.message).toMatch(
        `ME Hub API Url value is not in url format. Provided value is: ${data.value}`
      )
    }
  }
)

test('[ME Hub]: User can get the NFT service', () => {
  const nftService = hubService.getNFTService()
  expect(nftService).not.toBe(null)
  expect(nftService).toBeInstanceOf(MagicEdenNFTService)
})

test('[ME Hub]: User can get the Collection service', () => {
  const collectionService = hubService.getCollectionService()
  expect(collectionService).not.toBe(null)
  expect(collectionService).toBeInstanceOf(MagicEdenCollectionService)
})

test('[ME Hub]: User can get the Wallet service', () => {
  const walletService = hubService.getWalletService()
  expect(walletService).not.toBe(null)
  expect(walletService).toBeInstanceOf(MagicEdenWalletService)
})
