import { AxiosService } from '../axios/service.js'
import { ErrorHelper } from '../../helpers/error-helper.js'

export class MagicEdenWalletService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl
  }

  /**
   * @description Fetch ME wallet listed NFTs by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} params - Object like instance {offset: 0, limit: 100}
   * @returns
   */
  async getListedNFTs(walletAddress, params = { offset: 0, limit: 100 }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      `Wallet Address:${this.getListedNFTs.name}`
    )
    if (!walletAddress) {
      throw new Error(
        `Wallet Address value cannot be null/empty/undefined. Provided: ${walletAddress}`
      )
    }
    return await this.#getNFTs(walletAddress, {
      offset: params.offset,
      limit: params.limit,
      listStatus: 'listed',
    })
  }

  /**
   * @description Fetch ME wallet unlisted NFTs by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} params - Object like instance {offset: 0, limit: 100}
   * @returns {Array<any>}
   */
  async getUnlistedNFTs(walletAddress, params = { offset: 0, limit: 100 }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      `Wallet Address:${this.getUnlistedNFTs.name}`
    )
    const unlistedNfts = await this.#getNFTs(walletAddress, {
      offset: params.offset,
      limit: params.limit,
      listStatus: 'unlisted',
    })

    return unlistedNfts.data
  }

  /**
   * @description Fetch ME wallet listed & unlisted NFTs by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} params - Object like instance {offset: 0, limit: 100}
   * @returns
   */
  async getListedAndUnlistedNFTs(walletAddress, params = { offset: 0, limit: 100 }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      `Wallet Address:${this.getListedAndUnlistedNFTs.name}`
    )
    return await this.#getNFTs(walletAddress, {
      offset: params.offset,
      limit: params.limit,
      listStatus: 'both',
    })
  }

  /**
   * @description Fetch ME wallet offers that are made by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} params - Object like instance {offset: 0, limit: 100}
   * @returns
   */
  async getOffersMade(walletAddress, params = { offset: 0, limit: 100 }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      `Wallet Address:${this.getOffersMade.name}`
    )

    return await AxiosService.sendGet(
      `${this.apiUrl}/wallets/${walletAddress}/offers_made`,
      params
    )
  }

  /**
   * @description Fetch ME wallet offers that are received by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} params - Object like instance {offset: 0, limit: 100}
   * @returns
   */
  async getOffersReceived(walletAddress, params = { offset: 0, limit: 100 }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      `Wallet Address:${this.getOffersReceived.name}`
    )

    return await AxiosService.sendGet(
      `${this.apiUrl}/wallets/${walletAddress}/offers_received`,
      params
    )
  }

  /**
   * @description Get ME wallet balance
   * @param {String} walletAddress - Wallet Address (UUID)
   * @returns
   */
  async getBalance(walletAddress) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      `Wallet Address:${this.getBalance.name}`
    )

    return await AxiosService.sendGet(
      `${this.apiUrl}/wallets/${walletAddress}/escrow_balance`
    )
  }

  /**
   * @description (Internal) Fetch wallet unlisted/listed/both NFTs by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} params - Object like instance {offset: 0, limit: 100, listStatus: 'both'} //listStatus maybe be: both/listed/unlisted
   * @returns
   */
  async #getNFTs(
    walletAddress,
    params = { offset: 0, limit: 100, listStatus: null }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      params.listStatus,
      `list status`
    )
    return await AxiosService.sendGet(
      `${this.apiUrl}/wallets/${walletAddress}/tokens`,
      params
    )
  }
}
