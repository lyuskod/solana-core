import { AxiosServiceHub } from '../axios/hub.js'
import { ErrorHelper } from '../../helpers/error.js'
import { Logger } from '../../tools/logger.js'

export class MagicEdenNFTService {
  #currentServiceName = 'ME NFT'
  constructor(apiUrl) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(apiUrl, 'ME NFT API Url')
    ErrorHelper.throwErrorIfValueIsNotURL(apiUrl, 'ME NFT API Url')
    this.apiUrl = `${apiUrl}/tokens`
  }

  /**
   * @description Fetch information of a token / NFT
   * @param {String} nftMintAddress - NFT Token address (UUID)
   * @returns {Array<any>} - In case of not found, returns an empty array
   */
  async getNFTInfoByNFTMintAddress(
    nftMintAddress,
    log_opts = {
      logFetchedNFTInfo: false,
    }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      nftMintAddress,
      'NFT Mint Address'
    )

    Logger.silly(
      this.#currentServiceName,
      '[READY] Get nft info by nft mint address',
      nftMintAddress
    )

    let fetchedNFTInfo = await AxiosServiceHub.sendGet(
      `${this.apiUrl}/${nftMintAddress}`,
      {}
    )

    Logger.ready(
      this.#currentServiceName,
      'Get nft info by nft mint address',
      nftMintAddress,
      log_opts.logFetchedNFTInfo ? fetchedNFTInfo.data : null
    )

    return fetchedNFTInfo.data
  }
}
