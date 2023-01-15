import { NFTService } from './nft-service.js'
import { WalletService } from './wallet-service.js'

export class MEApiService {
  constructor(apiUrl) {
    this.nftService = new NFTService(apiUrl)
    this.walletService = new WalletService(apiUrl)
  }

  /**
   *
   * @returns {NFTService}
   */
  getNFTService() {
    return this.nftService
  }

  /**
   *
   * @returns {WalletService}
   */
  getWalletService() {
    return this.walletService
  }
}
