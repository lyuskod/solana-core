import { AxiosService } from '../../../framework/api/axios/service.js'
import { ErrorHelper } from '../../../framework/helpers/error-helper.js'

export class NFTService {
  constructor(apiUrl) {
    this.apiUrl = `${apiUrl}/tokens`
  }

  /**
   * @description Fetch information of a token / NFT
   * @param {String} nftAddress - NFT Token address (UUID)
   * @returns 
   */
  getNFTInfo(nftAddress) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      nftAddress,
      `NFT Address:${this.getNFTInfo.name}`
    )
    return AxiosService.sendGet(`${this.apiUrl}/${nftAddress}`, {})
  }
}
