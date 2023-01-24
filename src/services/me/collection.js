import { AxiosService } from '../axios/service.js'
import { ErrorHelper } from '../../helpers/error-helper.js'

export class MagicEdenCollectionService {
  constructor(apiUrl) {
    ErrorHelper.throwErrorIfValueIsNotURL(apiUrl)
    this.apiUrl = `${apiUrl}/collections`
  }

  /**
   * @description Fetch NFT collection information by collection symbol
   * @param {String} symbol - Collection symbol (String)
   * @returns
   */
  async getCollectionInfoByCollectionSymbol(symbol) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      symbol,
      `NFT Collection Symbol`
    )
    const collectionSymbol = await AxiosService.sendGet(
      `${this.apiUrl}/${symbol}`,
      {}
    )
    return collectionSymbol.data
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
    return AxiosService.sendGet(`${this.apiUrl}/${symbol}/activities`, params)
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
