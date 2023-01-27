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

test.each(valueErrorTestData)(
  '[ME NFT]: Error is thrown when user is trying to create an ME NFT service and url is null/undefined/empty',
  (data) => {
    try {
      hubService.getNFTService(data.type)
    } catch (e) {
      expect(e.message).toMatch(
        'ME NFT API Url value cannot be null/undefined/empty'
      )
    }
  }
)

test.each(invalidUrls)(
  '[ME NFT]: Error is thrown when user is trying to create an ME NFT service and url is not in url format',
  (data) => {
    try {
      hubService.getNFTService(data.type)
    } catch (e) {
      expect(e.message).toMatch(
        `ME NFT API Url value is not in url format. Provided value is: ${data.value}`
      )
    }
  }
)
const valueErrorTestDataWithEmpty = [
  {
    type: 'null',
    value: null,
  },
  {
    type: 'undefined',
    value: undefined,
  },
  {
    type: 'empty',
    value: '',
  },
]
test.each(valueErrorTestDataWithEmpty)(
  '[ME NFT]: Error is thrown when users is trying to fetch an NFT by mint address but the mint address is null/undefined/empty',
  async (data) => {
    try {
      await hubService.getNFTService().getNFTInfoByNFTMintAddress(data.value)
    } catch (e) {
      expect(e.message).toMatch(
        'NFT Mint Address value cannot be null/undefined/empty'
      )
    }
  }
)

test('[ME NFT]: User cant fetch an NFT metadata by mint address', async () => {
  const nftMintAddress = '6uMJKRytbd2WyhhGidN7SDiE6HbbQ6b2ni7w2aT5FUdC'
  const nftMetadata = await hubService
    .getNFTService()
    .getNFTInfoByNFTMintAddress(nftMintAddress)
  expect(nftMetadata).not.toBe(null)
  expect(nftMetadata.mintAddress).toEqual(nftMintAddress)
  expect(nftMetadata.name).toEqual('Darknet User #2173')
})

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: User cant create wallet instance if api url is undefined/null/empty',
  (data) => {
    try {
      new MagicEdenWalletService(data.value)
    } catch (e) {
      expect(e.message).toMatch(
        'ME Wallet API Url value cannot be null/undefined/empty'
      )
    }
  }
)

test.each(invalidUrls)(
  '[ME Wallet]: User cant create wallet instance if api url is not in url format',
  (data) => {
    try {
      new MagicEdenWalletService(data.value)
    } catch (e) {
      expect(e.message).toMatch(
        `ME Wallet API Url value is not in url format. Provided value is: ${data.value}`
      )
    }
  }
)

test('[ME Wallet]: User can fetch wallet balance', async () => {
  const walletAddress = 'Gf8gY7apY1xdYVbghoVMuPiYifRh1hfrMVnvQwYUCSYZ'
  const balance = await hubService
    .getWalletService()
    .getBalanceForWalletAddress(walletAddress)
  expect(balance.balance).not.toBe(null)
})

test('[ME Wallet]: User receives a 0 balance calling get balance for invalid wallet address', async () => {
  const walletAddress = 'Gf8gY7apY1xdYVbghoVMuPiYifRh1hfrMVnvQwYUCzYZ'
  const balance = await hubService
    .getWalletService()
    .getBalanceForWalletAddress(walletAddress)
  expect(balance.balance).not.toBe(null)
})

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: Error is thrown when user is trying to get a balance by providing an null/undefined/empty wallet address',
  async (data) => {
    try {
      await hubService.getWalletService().getBalanceForWalletAddress(data.value)
    } catch (e) {
      expect(e.message).toMatch(
        'Wallet address to get balance of value cannot be null/undefined/empty'
      )
    }
  }
)

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: Error is thrown when user is trying to fetch listed & unlisted nfts with undefined/null/empty nft mint address',
  async (data) => {
    try {
      await hubService
        .getWalletService()
        .getListedAndUnlistedNFTsByWalletAddress(data.value)
    } catch (e) {
      expect(e.message).toMatch(
        'Wallet Address for listed NFTs value cannot be null/undefined/empty'
      )
    }
  }
)

test('[ME Wallet]: User can fetch listed & unlisted NFTs by wallet', async () => {
  const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
  const listedAndUnlistedNfts = await hubService
    .getWalletService()
    .getListedAndUnlistedNFTsByWalletAddress(walletAddress)
  expect(listedAndUnlistedNfts).not.toBe(null)

  const listedNfts = listedAndUnlistedNfts.filter(
    (nft) => nft.listStatus === 'listed'
  )
  const unlistedNfts = listedAndUnlistedNfts.filter(
    (nft) => nft.listStatus === 'unlisted'
  )
  expect(listedNfts.length).toBeGreaterThanOrEqual(1)
  expect(unlistedNfts.length).toBeGreaterThanOrEqual(1)
})

test('[ME Wallet]: User can fetch listed & unlisted NFTs by wallet and offset them', async () => {
  const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
  const listedAndUnlistedNfts = await hubService
    .getWalletService()
    .getListedAndUnlistedNFTsByWalletAddress(walletAddress, {
      offset: 0,
      limit: 2,
    })
  const missedNFT = listedAndUnlistedNfts[0]
  const offsetedNFTs = await hubService
    .getWalletService()
    .getListedAndUnlistedNFTsByWalletAddress(walletAddress, {
      offset: 1,
      limit: 2,
    })
  expect(offsetedNFTs.includes(missedNFT)).toBe(false)
})

test.each(expectedLimits)(
  '[ME Wallet]: User can fetch listed & unlisted NFTs by wallet and limit them',
  async (data) => {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    const listedAndUnlistedNfts = await hubService
      .getWalletService()
      .getListedAndUnlistedNFTsByWalletAddress(walletAddress, {
        offset: 0,
        limit: data.value,
      })
    expect(listedAndUnlistedNfts).not.toBe(null)
    expect(listedAndUnlistedNfts.length).toEqual(data.value)
  }
)

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: Error is thrown if user provides an invalid offset value while fetching listed & unlisted nfts',
  async (data) => {
    try {
      const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
      await hubService
        .getWalletService()
        .getUnlistedNFTsByWalletAddress(walletAddress, {
          offset: data.value,
          limit: 2,
        })
    } catch (e) {
      expect(e.message).toMatch('Offset value cannot be null/undefined')
    }
  }
)

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: Error is thrown if user provides an invalid limit value while fetching listed & unlisted nfts',
  async (data) => {
    try {
      const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
      await hubService
        .getWalletService()
        .getUnlistedNFTsByWalletAddress(walletAddress, {
          offset: 0,
          limit: data.value,
        })
    } catch (e) {
      expect(e.message).toMatch('Limit value cannot be null/undefined')
    }
  }
)

test('[ME Wallet]: Error is thrown if user provides a negative limit value while fetching listed & unlisted nfts', async () => {
  try {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    await hubService
      .getWalletService()
      .getUnlistedNFTsByWalletAddress(walletAddress, {
        offset: 0,
        limit: -1,
      })
  } catch (e) {
    expect(e.message).toMatch('Limit value cannot be negative')
  }
})

test('[ME Wallet]: Error is thrown if user provides a negative offset value while fetching listed & unlisted nfts', async () => {
  try {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    await hubService
      .getWalletService()
      .getUnlistedNFTsByWalletAddress(walletAddress, {
        offset: -1,
        limit: 2,
      })
  } catch (e) {
    expect(e.message).toMatch('Offset value cannot be negative')
  }
})

test('[ME Wallet]: User can fetch listed NFTs by wallet', async () => {
  const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
  const listedNfts = await hubService
    .getWalletService()
    .getListedNFTsByWalletAddress(walletAddress)
  expect(listedNfts).not.toBe(null)
  expect(listedNfts.length).toBeGreaterThanOrEqual(1)
  const size = listedNfts.length
  const filtered = listedNfts.filter((nft) => nft.listStatus == 'listed')
  expect(filtered.length).toEqual(size)
})

test('[ME Wallet]: User can fetch listed by wallet and offset them', async () => {
  const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
  const listedNfts = await hubService
    .getWalletService()
    .getListedNFTsByWalletAddress(walletAddress, {
      offset: 0,
      limit: 2,
    })
  const missedNFT = listedNfts[0]
  const offsetedNFTs = await hubService
    .getWalletService()
    .getListedNFTsByWalletAddress(walletAddress, {
      offset: 1,
      limit: 2,
    })
  expect(offsetedNFTs.includes(missedNFT)).toBe(false)
})

test.each(expectedLimits)(
  '[ME Wallet]: User can fetch listed NFTs and limit them',
  async (data) => {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    const listedNfts = await hubService
      .getWalletService()
      .getListedNFTsByWalletAddress(walletAddress, {
        offset: 0,
        limit: data.value,
      })
    expect(listedNfts).not.toBe(null)
    expect(listedNfts.length).toEqual(data.value)
  }
)

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: Error is thrown if user provides an invalid offset value while fetching listed nfts',
  async (data) => {
    try {
      const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
      await hubService
        .getWalletService()
        .getListedNFTsByWalletAddress(walletAddress, {
          offset: data.value,
          limit: 2,
        })
    } catch (e) {
      expect(e.message).toMatch('Offset value cannot be null/undefined')
    }
  }
)

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: Error is thrown if user provides an invalid limit value while fetching listed nfts',
  async (data) => {
    try {
      const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
      await hubService
        .getWalletService()
        .getListedNFTsByWalletAddress(walletAddress, {
          offset: 0,
          limit: data.value,
        })
    } catch (e) {
      expect(e.message).toMatch('Limit value cannot be null/undefined')
    }
  }
)

test('[ME Wallet]: Error is thrown if user provides a negative limit value while fetching listednfts', async () => {
  try {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    await hubService
      .getWalletService()
      .getListedNFTsByWalletAddress(walletAddress, {
        offset: 0,
        limit: -1,
      })
  } catch (e) {
    expect(e.message).toMatch('Limit value cannot be negative')
  }
})

test('[ME Wallet]: Error is thrown if user provides a negative offset value while fetching listed nfts', async () => {
  try {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    await hubService
      .getWalletService()
      .getListedNFTsByWalletAddress(walletAddress, {
        offset: -1,
        limit: 2,
      })
  } catch (e) {
    expect(e.message).toMatch('Offset value cannot be negative')
  }
})

//test
test('[ME Wallet]: User can fetch unlisted NFTs by wallet', async () => {
  const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
  const unlistedNfts = await hubService
    .getWalletService()
    .getUnlistedNFTsByWalletAddress(walletAddress)
  expect(unlistedNfts).not.toBe(null)
  expect(unlistedNfts.length).toBeGreaterThanOrEqual(1)
  const size = unlistedNfts.length
  const filtered = unlistedNfts.filter((nft) => nft.listStatus == 'unlisted')
  expect(filtered.length).toEqual(size)
})

test('[ME Wallet]: User can fetch unlisted by wallet and offset them', async () => {
  const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
  const unlistedNfts = await hubService
    .getWalletService()
    .getUnlistedNFTsByWalletAddress(walletAddress, {
      offset: 0,
      limit: 2,
    })
  const missedNFT = unlistedNfts[0]
  const offsetedNFTs = await hubService
    .getWalletService()
    .getUnlistedNFTsByWalletAddress(walletAddress, {
      offset: 1,
      limit: 2,
    })
  expect(offsetedNFTs.includes(missedNFT)).toBe(false)
})

test.each(expectedLimits)(
  '[ME Wallet]: User can fetch unlisted NFTs and limit them',
  async (data) => {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    const unlistedNfts = await hubService
      .getWalletService()
      .getUnlistedNFTsByWalletAddress(walletAddress, {
        offset: 0,
        limit: data.value,
      })
    expect(unlistedNfts).not.toBe(null)
    expect(unlistedNfts.length).toEqual(data.value)
  }
)

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: Error is thrown if user provides an invalid offset value while fetching unlisted nfts',
  async (data) => {
    try {
      const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
      await hubService
        .getWalletService()
        .getUnlistedNFTsByWalletAddress(walletAddress, {
          offset: data.value,
          limit: 2,
        })
    } catch (e) {
      expect(e.message).toMatch('Offset value cannot be null/undefined')
    }
  }
)

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: Error is thrown if user provides an invalid limit value while fetching unlisted nfts',
  async (data) => {
    try {
      const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
      await hubService
        .getWalletService()
        .getUnlistedNFTsByWalletAddress(walletAddress, {
          offset: 0,
          limit: data.value,
        })
    } catch (e) {
      expect(e.message).toMatch('Limit value cannot be null/undefined')
    }
  }
)

test('[ME Wallet]: Error is thrown if user provides a negative limit value while fetching unlisted nfts', async () => {
  try {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    await hubService
      .getWalletService()
      .getUnlistedNFTsByWalletAddress(walletAddress, {
        offset: 0,
        limit: -1,
      })
  } catch (e) {
    expect(e.message).toMatch('Limit value cannot be negative')
  }
})

test('[ME Wallet]: Error is thrown if user provides a negative offset value while fetching unlisted nfts', async () => {
  try {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    await hubService
      .getWalletService()
      .getUnlistedNFTsByWalletAddress(walletAddress, {
        offset: -1,
        limit: 2,
      })
  } catch (e) {
    expect(e.message).toMatch('Offset value cannot be negative')
  }
})

test('[ME Wallet]: User can fetch offers made by wallet address', async () => {
  const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
  const offersMade = await hubService
    .getWalletService()
    .getOffersMadeByWalletAddress(walletAddress)
  expect(offersMade).not.toBe(null)
  expect(offersMade).toEqual([])
})

test('[ME Wallet]: User can fetch offers made by invalid wallet address', async () => {
  const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1ysF'
  const offersMade = await hubService
    .getWalletService()
    .getOffersMadeByWalletAddress(walletAddress)
  expect(offersMade).not.toBe(null)
  expect(offersMade).toEqual([])
})

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: Error is thrown if user provides an invalid offset value while fetching offers made',
  async (data) => {
    try {
      const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
      await hubService
        .getWalletService()
        .getOffersMadeByWalletAddress(walletAddress, {
          offset: data.value,
          limit: 2,
        })
    } catch (e) {
      expect(e.message).toMatch('Offset value cannot be null/undefined')
    }
  }
)

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: Error is thrown if user provides an invalid limit value while fetching offers made',
  async (data) => {
    try {
      const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
      await hubService
        .getWalletService()
        .getOffersMadeByWalletAddress(walletAddress, {
          offset: 0,
          limit: data.value,
        })
    } catch (e) {
      expect(e.message).toMatch('Limit value cannot be null/undefined')
    }
  }
)

test('[ME Wallet]: Error is thrown if user provides a negative limit value while fetching offers made', async () => {
  try {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    await hubService
      .getWalletService()
      .getOffersMadeByWalletAddress(walletAddress, {
        offset: 0,
        limit: -1,
      })
  } catch (e) {
    expect(e.message).toMatch('Limit value cannot be negative')
  }
})

test('[ME Wallet]: Error is thrown if user provides a negative offset value while fetching offers made', async () => {
  try {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    await hubService
      .getWalletService()
      .getOffersMadeByWalletAddress(walletAddress, {
        offset: -1,
        limit: 2,
      })
  } catch (e) {
    expect(e.message).toMatch('Offset value cannot be negative')
  }
})

test('[ME Wallet]: User can fetch offers received by wallet address', async () => {
  const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
  const offersMade = await hubService
    .getWalletService()
    .getOffersReceivedByWalletAddress(walletAddress)
  expect(offersMade).not.toBe(null)
  expect(offersMade).toEqual([])
})

test('[ME Wallet]: User can fetch offers received by invalid wallet address', async () => {
  const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1ysF'
  const offersMade = await hubService
    .getWalletService()
    .getOffersReceivedByWalletAddress(walletAddress)
  expect(offersMade).not.toBe(null)
  expect(offersMade).toEqual([])
})

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: Error is thrown if user provides an invalid offset value while fetching offers received',
  async (data) => {
    try {
      const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
      await hubService
        .getWalletService()
        .getOffersReceivedByWalletAddress(walletAddress, {
          offset: data.value,
          limit: 2,
        })
    } catch (e) {
      expect(e.message).toMatch('Offset value cannot be null/undefined')
    }
  }
)

test.each(valueErrorTestDataWithEmpty)(
  '[ME Wallet]: Error is thrown if user provides an invalid limit value while fetching offers received',
  async (data) => {
    try {
      const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
      await hubService
        .getWalletService()
        .getOffersReceivedByWalletAddress(walletAddress, {
          offset: 0,
          limit: data.value,
        })
    } catch (e) {
      expect(e.message).toMatch('Limit value cannot be null/undefined')
    }
  }
)

test('[ME Wallet]: Error is thrown if user provides a negative limit value while fetching offers received', async () => {
  try {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    await hubService
      .getWalletService()
      .getOffersReceivedByWalletAddress(walletAddress, {
        offset: 0,
        limit: -1,
      })
  } catch (e) {
    expect(e.message).toMatch('Limit value cannot be negative')
  }
})

test('[ME Wallet]: Error is thrown if user provides a negative offset value while fetching offers received', async () => {
  try {
    const walletAddress = '6RGNXDdbA4kVcLdXHnAn81M81UDmSiAmwnseAWLw1yuF'
    await hubService
      .getWalletService()
      .getOffersReceivedByWalletAddress(walletAddress, {
        offset: -1,
        limit: 2,
      })
  } catch (e) {
    expect(e.message).toMatch('Offset value cannot be negative')
  }
})
