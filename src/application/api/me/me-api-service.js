import { NFTService } from './nft-service.js'

export class MEApiService {
  constructor(apiUrl) {
    this.nftService = new NFTService(apiUrl)
  }

  /**
   *
   * @returns {NFTService}
   */
  getNFTService() {
    return this.nftService
  }
}
