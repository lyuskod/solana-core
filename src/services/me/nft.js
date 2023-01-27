import { AxiosServiceHub } from '../axios/hub.js'
import { ErrorHelper } from '../../helpers/error-helper.js'
import { LoggerTool } from '../../tools/logger-tool.js'

export class MagicEdenNFTService {
  #currentServiceName = 'ME NFT'
  constructor(apiUrl) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(apiUrl)
    this.apiUrl = `${apiUrl}/tokens`
  }

  /**
   * @description Fetch information of a token / NFT
   * @param {String} nftMintAddress - NFT Token address (UUID)
   * @returns - In case of not found, returns an empty array
   */
  async getNFTInfoByNFTMintAddress(
    nftMintAddress,
    log_opts = {
      logFetchedNFTInfo: false,
    }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      nftMintAddress,
      `NFT Mint Address`
    )

    LoggerTool.silly(
      this.#currentServiceName,
      '[READY] Get nft info by nft mint address',
      nftMintAddress
    )

    let fetchedNFTInfo = await AxiosServiceHub.sendGet(
      `${this.apiUrl}/${nftMintAddress}`,
      {}
    )

    LoggerTool.silly(
      this.#currentServiceName,
      '[SUCCESS] Get nft info by nft mint address',
      nftMintAddress,
      log_opts.logFetchedNFTInfo ? fetchedNFTInfo.data : null
    )

    return fetchedNFTInfo.data
  }
}
