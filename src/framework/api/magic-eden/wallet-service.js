import { AxiosService } from '../axios/service.js'
import { ErrorHelper } from '../../helpers/error-helper.js'

export class WalletService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl
  }

  /**
   * @description Fetch ME wallet listed NFTs by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} params - Object like instance {offset: 0, limit: 100}
   * @returns
   */
  getListedNFTs(walletAddress, params = { offset: 0, limit: 100 }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      `Wallet Address:${this.getListedNFTs.name}`
    )
    if (!walletAddress) {
      throw new Error(
        `Wallet Address value cannot be null/empty/undefined. Provided: ${walletAddress}`
      )
    }
    return this.#getNFTs(walletAddress, {
      offset: params.offset,
      limit: params.limit,
      listStatus: 'listed',
    })
  }

  /**
   * @description Fetch ME wallet unlisted NFTs by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} params - Object like instance {offset: 0, limit: 100}
   * @returns
   */
  getUnlistedNFTs(walletAddress, params = { offset: 0, limit: 100 }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      `Wallet Address:${this.getUnlistedNFTs.name}`
    )
    return this.#getNFTs(walletAddress, {
      offset: params.offset,
      limit: params.limit,
      listStatus: 'unlisted',
    })
  }

  /**
   * @description Fetch ME wallet listed & unlisted NFTs by params
   * @param {String} walletAddress - Wallet Address (UUID)
   * @param {Object} params - Object like instance {offset: 0, limit: 100}
   * @returns
   */
  getListedAndUnlistedNFTs(walletAddress, params = { offset: 0, limit: 100 }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      `Wallet Address:${this.getListedAndUnlistedNFTs.name}`
    )
    return this.#getNFTs(walletAddress, {
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
  getOffersMade(walletAddress, params = { offset: 0, limit: 100 }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      `Wallet Address:${this.getOffersMade.name}`
    )

    return AxiosService.sendGet(
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
  getOffersReceived(walletAddress, params = { offset: 0, limit: 100 }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      `Wallet Address:${this.getOffersReceived.name}`
    )

    return AxiosService.sendGet(
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
  #getNFTs(
    walletAddress,
    params = { offset: 0, limit: 100, listStatus: null }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      params.listStatus,
      `params.listStatus:${this.getNFTs.name}`
    )
    return AxiosService.sendGet(
      `${this.apiUrl}/wallets/${walletAddress}/tokens`,
      params
    )
  }
}
