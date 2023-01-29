import { AxiosServiceHub } from '../axios/hub.js'
import { ErrorHelper } from '../../helpers/error.js'
import { Logger } from '../../tools/logger.js'

export class MagicEdenCollectionService {
  #currentServiceName = 'ME Collection'
  constructor(apiUrl) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      apiUrl,
      'ME Collection Serice: API Url'
    )
    ErrorHelper.throwErrorIfValueIsNotURL(
      apiUrl,
      'ME Collection Serice: API Url'
    )
    this.apiUrl = `${apiUrl}/collections`
  }

  /**
   * @description Fetch NFT collection information by collection symbol
   * @param {String} nftCollectionSymbol - Collection symbol (String)
   * @param {String} log_opts - Log fetched collection info
   * @returns
   */
  async getCollectionInfoByCollectionSymbol(
    nftCollectionSymbol,
    log_opts = { logFetchedCollectionInfo: false }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      nftCollectionSymbol,
      'Collection Symbol'
    )

    Logger.ready(
      this.#currentServiceName,
      'Ready to get ME collection info by collection symbol',
      nftCollectionSymbol
    )

    let fetchedCollectionInfo = null
    try {
      fetchedCollectionInfo = await AxiosServiceHub.sendGet(
        `${this.apiUrl}/${nftCollectionSymbol}`,
        {}
      )
    } catch (e) {
      const errorMessage =
        'Error to get ME collection info by collection symbol'
      Logger.error(
        this.#currentServiceName,
        errorMessage,
        nftCollectionSymbol,
        e.message
      )
      throw new Error(`${errorMessage}\n${e.message}`)
    }

    Logger.success(
      this.#currentServiceName,
      'Success to get ME collection info by collection symbol',
      nftCollectionSymbol,
      log_opts.logFetchedCollectionInfo ? fetchedCollectionInfo.data : null
    )

    return fetchedCollectionInfo.data
  }

  /**
   * @description Fetch NFT collection activities by collection symbol
   * @param {String} nftCollectionSymbol - Collection symbol (String)
   * @param {String} params - Object like instance {offset: 0, limit: 100, logFetchedCollectionActivities: false}
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

    Logger.ready(
      this.#currentServiceName,
      'Ready to get ME collection activities by collection symbol',
      nftCollectionSymbol
    )

    let fetchedCollectionActivities = await AxiosServiceHub.sendGet(
      `${this.apiUrl}/${nftCollectionSymbol}/activities`,
      args
    )

    Logger.success(
      this.#currentServiceName,
      'Success to get ME collection activities by collection symbol',
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
   * @param {Object} log_opts - Log fetched statistics
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

    Logger.ready(
      this.#currentServiceName,
      'Ready to get ME collection statistics by collection symbol',
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
        'Error to get ME collection statistics by collection symbol',
        nftCollectionSymbol,
        e.message
      )
      throw new Error(e.message)
    }

    Logger.success(
      this.#currentServiceName,
      'Success to get ME collection statistics by collection symbol',
      nftCollectionSymbol,
      log_opts.logFetchedStats ? fetchedCollectionStats.data : null
    )

    return fetchedCollectionStats.data
  }
}
