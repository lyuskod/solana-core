import { AxiosService } from '../../../framework/api/axios-api.js'

export class NFTService {
  constructor(apiUrl) {
    this.apiUrl = `${apiUrl}/tokens`
  }

  getNFTInfo(nftAddress) {
    if (!nftAddress) {
      throw new Error(
        `NFT Address value cannot be null/empty/undefined. Provided: ${nftAddress}`
      )
    }
    return AxiosService.sendGet(`${this.apiUrl}/${nftAddress}`, {})
  }
}
