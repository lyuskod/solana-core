import { AxiosService } from '../../../framework/api/axios-api.js'

export class WalletService {
  constructor(apiUrl) {
    this.apiUrl = `${apiUrl}/wallets`
  }

  getListedNFTs(walletAddress, params = { offset: 0, limit: 100 }) {
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

  getUnlistedNFTs(walletAddress, params = { offset: 0, limit: 100 }) {
    if (!walletAddress) {
      throw new Error(
        `Wallet Address value cannot be null/empty/undefined. Provided: ${walletAddress}`
      )
    }
    return this.#getNFTs(walletAddress, {
      offset: params.offset,
      limit: params.limit,
      listStatus: 'unlisted',
    })
  }

  #getNFTs(
    walletAddress,
    params = { offset: 0, limit: 100, listStatus: null }
  ) {
    if (!params.listStatus) {
      throw new Error(
        `listStatus value cannot be null/undefined/empty. Provided: '${listStatus}'`
      )
    }
    return AxiosService.sendGet(
      `${this.apiUrl}/${walletAddress}/tokens`,
      params
    )
  }
}
