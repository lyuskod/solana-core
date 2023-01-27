import { AxiosServiceHub } from '../axios/hub.js'
import { ErrorHelper } from '../../helpers/error-helper.js'
import { Logger } from '../../tools/logger.js'

export class MagicEdenCollectionService {
  #currentServiceName = 'ME Collection'
  constructor(apiUrl) {
    ErrorHelper.throwErrorIfValueIsNotURL(apiUrl)
    this.apiUrl = `${apiUrl}/collections`
  }

  /**
   * @description Fetch NFT collection information by collection symbol
   * @param {String} nftCollectionSymbol - Collection symbol (String)
   * @returns
   */
  async getCollectionInfoByCollectionSymbol(
    nftCollectionSymbol,
    log_opts = { logFetchedCollectionInfo: false }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      nftCollectionSymbol,
      'NFT Collection Symbol'
    )

    Logger.silly(
      this.#currentServiceName,
      '[READY] Get collection info by collection symbol',
      nftCollectionSymbol
    )

    let fetchedCollectionInfo = null
    try {
      fetchedCollectionInfo = await AxiosServiceHub.sendGet(
        `${this.apiUrl}/${nftCollectionSymbol}`,
        {}
      )
    } catch (e) {
      Logger.error(
        this.#currentServiceName,
        `[ERROR] Error to get collection info by collection symbol`,
        nftCollectionSymbol,
        e.message
      )
      throw new Error(e.message)
    }

    Logger.silly(
      this.#currentServiceName,
      '[SUCCESS] Get collection info by collection symbol',
      nftCollectionSymbol,
      log_opts.logFetchedCollectionInfo ? fetchedCollectionInfo.data : null
    )

    return fetchedCollectionInfo.data
  }

  /**
   * @description Fetch NFT collection activities by collection symbol
   * @param {String} nftCollectionSymbol - Collection symbol (String)
   * @param {String} params - Object like instance {offset: 0, limit: 100}
   * @returns - In case of not found, returns an empty array
   */
  async getCollectionActivitiesByCollectionSymbol(
    nftCollectionSymbol,
    args = { offset: 0, limit: 100, logFetchedCollectionActivities: false }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      nftCollectionSymbol,
      'Collection Symbol'
    )
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(args.offset, 'Offset')
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(args.limit, 'Limit')
    ErrorHelper.throwErrorIfValueIsNegative(args.offset, 'Offset')
    ErrorHelper.throwErrorIfValueIsNegative(args.limit, 'Limit')

    Logger.silly(
      this.#currentServiceName,
      '[READY] Get collection activities by collection symbol',
      nftCollectionSymbol
    )

    let fetchedCollectionActivities = await AxiosServiceHub.sendGet(
      `${this.apiUrl}/${nftCollectionSymbol}/activities`,
      args
    )

    Logger.silly(
      this.#currentServiceName,
      '[SUCCESS] Get collection activities by collection symbol',
      nftCollectionSymbol,
      args.logFetchedCollectionActivities
        ? fetchedCollectionActivities.data
        : null
    )

    return fetchedCollectionActivities.data
  }

  /**
   * @description Fetch NFT collection statistics by collection symbol
   * @param {String} nftCollectionSymbol - Collection symbol (String)
   * @returns
   */
  async getCollectionStatsByCollectionSymbol(
    nftCollectionSymbol,
    log_opts = {
      logFetchedStats: false,
    }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      nftCollectionSymbol,
      'Collection Symbol'
    )

    Logger.silly(
      this.#currentServiceName,
      '[READY] Get collection stats by collection symbol',
      nftCollectionSymbol
    )

    let fetchedCollectionStats = null
    try {
      fetchedCollectionStats = await AxiosServiceHub.sendGet(
        `${this.apiUrl}/${nftCollectionSymbol}/stats`
      )
    } catch (e) {
      Logger.error(
        this.#currentServiceName,
        '[ERROR] Error to get collection stats by collection symbol',
        nftCollectionSymbol,
        e.message
      )
      throw new Error(e.message)
    }

    Logger.silly(
      this.#currentServiceName,
      '[SUCCESS] Get collection activities by collection symbol',
      nftCollectionSymbol,
      log_opts.logFetchedStats ? fetchedCollectionStats.data : null
    )

    return fetchedCollectionStats.data
  }
}
