import { ErrorHelper } from '../../helpers/error.js'
import { Logger } from '../../tools/logger.js'

export class MagicEdenWalletService {
  #currentServiceName = 'ME Wallet'
  constructor(apiUrl) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(apiUrl)
    this.apiUrl = apiUrl
  }

  /**
   * @description Fetch ME wallet listed NFTs by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} args - Object like instance {offset: 0, limit: 100}
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

    Logger.silly(
      this.#currentServiceName,
      '[READY] Get listed nfts for provided wallet address',
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
        '[ERROR] Error to get listed nfts for provided wallet address',
        walletAddress,
        {
          offset: args.offset,
          limit: args.limit,
        },
        e.message
      )
      throw new Error(e.message)
    }

    Logger.silly(
      this.#currentServiceName,
      '[SUCCESS] Get listed nfts for provided wallet address',
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
   * @param {Object} args - Object like instance {offset: 0, limit: 100}
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

    Logger.silly(
      this.#currentServiceName,
      '[READY] Get unlisted nfts for provided wallet address',
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
        '[ERROR] Error to get unlisted nfts for provided wallet address',
        walletAddress,
        {
          offset: args.offset,
          limit: args.limit,
        },
        e.message
      )
      throw new Error(e.message)
    }

    Logger.silly(
      this.#currentServiceName,
      '[SUCCESS] Get unlisted nfts for provided wallet address',
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
   * @param {Object} args - Object like instance {offset: 0, limit: 100}
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

    Logger.silly(
      this.#currentServiceName,
      '[READY] Get unlisted & listed nfts for provided wallet address',
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
        '[ERROR] Error to get unlisted & listed nfts for provided wallet address',
        walletAddress,
        {
          offset: args.offset,
          limit: args.limit,
        },
        e.message
      )
      throw new Error(e.message)
    }

    Logger.silly(
      this.#currentServiceName,
      '[SUCCESS] Get unlisted & listed nfts for provided wallet address',
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
   * @param {Object} args - Object like instance {offset: 0, limit: 100}
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

    Logger.silly(
      this.#currentServiceName,
      '[READY] Get offers made for provided wallet address',
      walletAddress,
      {
        offset: args.offset,
        limit: args.limit,
      }
    )

    let fetchedOffersMade = null
    try {
      fetchedOffersMade = await AxiosService.sendGet(
        `${this.apiUrl}/wallets/${walletAddress}/offers_made`,
        args
      )
    } catch (e) {
      Logger.error(
        this.#currentServiceName,
        '[ERROR] Error to get offers made for provided wallet address',
        walletAddress,
        {
          offset: args.offset,
          limit: args.limit,
        },
        e.message
      )
      throw new Error(e.message)
    }

    Logger.silly(
      this.#currentServiceName,
      '[SUCCESS] Get offers made for provided wallet address',
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
   * @param {Object} args - Object like instance {offset: 0, limit: 100}
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

    Logger.silly(
      this.#currentServiceName,
      '[READY] Get offers received for provided wallet address',
      walletAddress,
      {
        offset: args.offset,
        limit: args.limit,
      }
    )

    let fetchedOffersReceived = null
    try {
      fetchedOffersReceived = await AxiosService.sendGet(
        `${this.apiUrl}/wallets/${walletAddress}/offers_received`,
        args
      )
    } catch (e) {
      Logger.error(
        this.#currentServiceName,
        '[ERROR] Error to get offers received for provided wallet address',
        walletAddress,
        {
          offset: args.offset,
          limit: args.limit,
        },
        e.message
      )
      throw new Error(e.message)
    }

    Logger.silly(
      this.#currentServiceName,
      '[SUCCESS] Get offers received for provided wallet address',
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

    Logger.silly(
      this.#currentServiceName,
      '[READY] Get SOL balance of provided wallet address',
      walletAddress
    )

    let fetchedWalletBalance = null
    try {
      fetchedWalletBalance = await AxiosService.sendGet(
        `${this.apiUrl}/wallets/${walletAddress}/escrow_balance`
      )
    } catch (e) {
      Logger.error(
        this.#currentServiceName,
        '[ERROR] Error to get SOL balance of provided wallet address',
        walletAddress,
        e.message
      )
      throw new Error(e.message)
    }

    Logger.silly(
      this.#currentServiceName,
      '[SUCCESS] Get offers received for provided wallet address',
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
    return await AxiosService.sendGet(
      `${this.apiUrl}/wallets/${walletAddress}/tokens`,
      args
    )
  }
}
