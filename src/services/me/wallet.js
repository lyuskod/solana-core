import { ErrorHelper } from '../../helpers/error.js'
import { Logger } from '../../tools/logger.js'
import { AxiosServiceHub } from '../axios/hub.js'

export class MagicEdenWalletService {
  #currentServiceName = 'ME Wallet Service'
  constructor(apiUrl) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(apiUrl, 'ME Wallet API Url')
    ErrorHelper.throwErrorIfValueIsNotURL(apiUrl, 'ME Wallet API Url')
    this.apiUrl = apiUrl
  }

  /**
   * @description Fetch ME wallet listed NFTs by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} args - Object like instance {offset: 0, limit: 100, logFetchedListedNFTs: false}
   * @returns
   */
  async getListedNFTsByWalletAddress(
    walletAddress,
    args = { offset: 0, limit: 100, logFetchedListedNFTs: false }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      'Wallet Address for listed NFTs'
    )
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(args.offset, 'Offset')
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(args.limit, 'Limit')
    ErrorHelper.throwErrorIfValueIsNegative(args.offset, 'Offset')
    ErrorHelper.throwErrorIfValueIsNegative(args.limit, 'Limit')

    Logger.ready(
      this.#currentServiceName,
      'Ready to get listed nfts on ME of provided wallet address',
      walletAddress,
      {
        offset: args.offset,
        limit: args.limit,
      }
    )

    let fetchedListedNFTs = null
    try {
      fetchedListedNFTs = await this.#getNFTs(walletAddress, {
        offset: args.offset,
        limit: args.limit,
        listStatus: 'listed',
      })
    } catch (e) {
      Logger.error(
        this.#currentServiceName,
        'Error to get listed nfts on ME of provided wallet address',
        walletAddress,
        {
          offset: args.offset,
          limit: args.limit,
        },
        e.message
      )
      throw new Error(e.message)
    }

    Logger.success(
      this.#currentServiceName,
      'Success to get listed nfts on ME of provided wallet address',
      walletAddress,
      {
        offset: args.offset,
        limit: args.limit,
      },
      args.logFetchedListedNFTs ? fetchedListedNFTs.data : null
    )

    return fetchedListedNFTs.data
  }

  /**
   * @description Fetch ME wallet unlisted NFTs by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} args - Object like instance {offset: 0, limit: 100, logFetchedListedNFTs: false}
   * @returns {Array<any>}
   */
  async getUnlistedNFTsByWalletAddress(
    walletAddress,
    args = { offset: 0, limit: 100, logFetchedListedNFTs: false }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      'Wallet Address for listed NFTs'
    )
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(args.offset, 'Offset')
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(args.limit, 'Limit')
    ErrorHelper.throwErrorIfValueIsNegative(args.offset, 'Offset')
    ErrorHelper.throwErrorIfValueIsNegative(args.limit, 'Limit')

    Logger.ready(
      this.#currentServiceName,
      'Ready to get unlisted nfts on ME of provided wallet address',
      walletAddress,
      {
        offset: args.offset,
        limit: args.limit,
      }
    )

    let fetchedUnlistedNFTs = null
    try {
      fetchedUnlistedNFTs = await this.#getNFTs(walletAddress, {
        offset: args.offset,
        limit: args.limit,
        listStatus: 'unlisted',
      })
    } catch (e) {
      Logger.error(
        this.#currentServiceName,
        'Error to get unlisted nfts on ME of provided wallet address',
        walletAddress,
        {
          offset: args.offset,
          limit: args.limit,
        },
        e.message
      )
      throw new Error(e.message)
    }

    Logger.success(
      this.#currentServiceName,
      'Success to get unlisted nfts on ME of provided wallet address',
      walletAddress,
      {
        offset: args.offset,
        limit: args.limit,
      },
      args.logFetchedUnlistedNFTs ? fetchedUnlistedNFTs.data : null
    )

    return fetchedUnlistedNFTs.data
  }

  /**
   * @description Fetch ME wallet listed & unlisted NFTs by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} args - Object like instance {offset: 0, limit: 100, logFetchedNFTs: false}
   * @returns
   */
  async getListedAndUnlistedNFTsByWalletAddress(
    walletAddress,
    args = { offset: 0, limit: 100, logFetchedNFTs: false }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      'Wallet Address for listed NFTs'
    )
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(args.offset, 'Offset')
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(args.limit, 'Limit')
    ErrorHelper.throwErrorIfValueIsNegative(args.offset, 'Offset')
    ErrorHelper.throwErrorIfValueIsNegative(args.limit, 'Limit')

    Logger.ready(
      this.#currentServiceName,
      'Ready to get unlisted & listed nfts on ME of provided wallet address',
      walletAddress,
      {
        offset: args.offset,
        limit: args.limit,
      }
    )

    let fetchedListedAndUnlistedNFTs = null
    try {
      fetchedListedAndUnlistedNFTs = await this.#getNFTs(walletAddress, {
        offset: args.offset,
        limit: args.limit,
        listStatus: 'both',
      })
    } catch (e) {
      Logger.error(
        this.#currentServiceName,
        'Error to get unlisted & listed nfts on ME of provided wallet address',
        walletAddress,
        {
          offset: args.offset,
          limit: args.limit,
        },
        e.message
      )
      throw new Error(e.message)
    }

    Logger.success(
      this.#currentServiceName,
      'Success to get unlisted & listed nfts on ME of provided wallet address',
      walletAddress,
      {
        offset: args.offset,
        limit: args.limit,
      },
      args.logFetchedNFTs ? fetchedListedAndUnlistedNFTs.data : null
    )

    return fetchedListedAndUnlistedNFTs.data
  }

  /**
   * @description Fetch ME wallet offers that are made by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} args - Object like instance {offset: 0, limit: 100, logFetchedOffersMade: false}
   * @returns
   */
  async getOffersMadeByWalletAddress(
    walletAddress,
    args = { offset: 0, limit: 100, logFetchedOffersMade: false }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      'Wallet Address to get offers made from'
    )
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(args.offset, 'Offset')
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(args.limit, 'Limit')
    ErrorHelper.throwErrorIfValueIsNegative(args.offset, 'Offset')
    ErrorHelper.throwErrorIfValueIsNegative(args.limit, 'Limit')

    Logger.ready(
      this.#currentServiceName,
      'Ready to get offers made by provided wallet address on ME',
      walletAddress,
      {
        offset: args.offset,
        limit: args.limit,
      }
    )

    let fetchedOffersMade = null
    try {
      fetchedOffersMade = await AxiosServiceHub.sendGet(
        `${this.apiUrl}/wallets/${walletAddress}/offers_made`,
        args
      )
    } catch (e) {
      Logger.error(
        this.#currentServiceName,
        'Error to get offers made by provided wallet address on ME',
        walletAddress,
        {
          offset: args.offset,
          limit: args.limit,
        },
        e.message
      )
      throw new Error(e.message)
    }

    Logger.success(
      this.#currentServiceName,
      'Success to get offers made by provided wallet address on ME',
      walletAddress,
      {
        offset: args.offset,
        limit: args.limit,
      },
      args.logFetchedOffersMade ? fetchedOffersMade.data : null
    )

    return fetchedOffersMade.data
  }

  /**
   * @description Fetch ME wallet offers that are received by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} args - Object like instance {offset: 0, limit: 100, logFetchedOffersReceived: false}
   * @returns
   */
  async getOffersReceivedByWalletAddress(
    walletAddress,
    args = { offset: 0, limit: 100, logFetchedOffersReceived: false }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      'Wallet Address to get offers received to'
    )
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(args.offset, 'Offset')
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(args.limit, 'Limit')
    ErrorHelper.throwErrorIfValueIsNegative(args.offset, 'Offset')
    ErrorHelper.throwErrorIfValueIsNegative(args.limit, 'Limit')

    Logger.ready(
      this.#currentServiceName,
      'Ready to get offers received to provided wallet address on ME',
      walletAddress,
      {
        offset: args.offset,
        limit: args.limit,
      }
    )

    let fetchedOffersReceived = null
    try {
      fetchedOffersReceived = await AxiosServiceHub.sendGet(
        `${this.apiUrl}/wallets/${walletAddress}/offers_received`,
        args
      )
    } catch (e) {
      Logger.error(
        this.#currentServiceName,
        'Error to get offers received to provided wallet address on ME',
        walletAddress,
        {
          offset: args.offset,
          limit: args.limit,
        },
        e.message
      )
      throw new Error(e.message)
    }

    Logger.success(
      this.#currentServiceName,
      'Success to get offers received to provided wallet address on ME',
      walletAddress,
      {
        offset: args.offset,
        limit: args.limit,
      },
      args.logFetchedOffersReceived ? fetchedOffersReceived.data : null
    )

    return fetchedOffersReceived.data
  }

  /**
   * @description Get ME wallet balance
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {String} log_opts - Log fetched wallet balance
   * @returns
   */
  async getBalanceForWalletAddress(
    walletAddress,
    log_opts = { logFetchedMEWalletBalance: false }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      'Wallet address to get balance of'
    )

    Logger.ready(
      this.#currentServiceName,
      'Ready to get SOL balance of provided wallet address on ME',
      walletAddress
    )

    let fetchedWalletBalance = null
    try {
      fetchedWalletBalance = await AxiosServiceHub.sendGet(
        `${this.apiUrl}/wallets/${walletAddress}/escrow_balance`
      )
    } catch (e) {
      Logger.error(
        this.#currentServiceName,
        'Error to get SOL balance of provided wallet address on ME',
        walletAddress,
        e.message
      )
      throw new Error(e.message)
    }

    Logger.success(
      this.#currentServiceName,
      'Success to get SOL balance of provided wallet address on ME',
      walletAddress,
      log_opts.logFetchedMEWalletBalance ? fetchedWalletBalance.data : null
    )

    return fetchedWalletBalance.data
  }

  /**
   * @description (Internal) Fetch wallet unlisted/listed/both NFTs by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} args - Object like instance {offset: 0, limit: 100, listStatus: 'both'} //listStatus maybe be: both/listed/unlisted
   * @returns
   */
  async #getNFTs(
    walletAddress,
    args = { offset: 0, limit: 100, listStatus: null }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(args.listStatus, `list status`)
    return await AxiosServiceHub.sendGet(
      `${this.apiUrl}/wallets/${walletAddress}/tokens`,
      args
    )
  }
}
