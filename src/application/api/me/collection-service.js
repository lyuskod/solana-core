import { AxiosService } from '../../../framework/api/axios-api.js'
import { ErrorHelper } from '../../../framework/helpers/error-helper.js'

export class CollectionService {
  constructor(apiUrl) {
    this.apiUrl = `${apiUrl}/collections`
  }

  /**
   * @description Fetch NFT collection information by collection symbol
   * @param {String} symbol - Collection symbol (String)
   * @returns
   */
  getInfoByCollectionSymbol(symbol) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      symbol,
      `Symbol:${this.getInfoByCollectionSymbol.name}`
    )
    return AxiosService.sendGet(`${this.apiUrl}/${symbol}`, {})
  }

  /**
   * @description Fetch NFT collection activities by collection symbol
   * @param {String} symbol - Collection symbol (String)
   * @param {String} params - Object like instance {offset: 0, limit: 100}
   * @returns
   */
  getActivities(symbol, params = { offset: 0, limit: 100 }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      symbol,
      `Symbol:${this.getActivities.name}`
    )
    return AxiosService.sendGet(
      `${this.apiUrl}/${symbol}/activities`,
      params
    )
  }

  /**
   * @description Fetch NFT collection statistics by collection symbol
   * @param {String} symbol - Collection symbol (String)
   * @returns
   */
  getStats(symbol) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      symbol,
      `Symbol:${this.getStats.name}`
    )
    return AxiosService.sendGet(`${this.apiUrl}/${symbol}/stats`)
  }
}
