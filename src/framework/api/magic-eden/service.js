import { NFTService } from './nft-service.js'
import { WalletService } from './wallet-service.js'
import { CollectionService } from './collection-service.js'

export class MEApiService {
  #nftService
  #walletService
  #collectionService

  constructor(apiUrl) {
    this.#nftService = new NFTService(apiUrl)
    this.#walletService = new WalletService(apiUrl)
    this.#collectionService = new CollectionService(apiUrl)
  }

  /**
   * @description Get ME nft service object
   * @returns {NFTService}
   */
  getNFTService() {
    return this.#nftService
  }

  /**
   * @description Get ME wallet service object
   * @returns {WalletService}
   */
  getWalletService() {
    return this.#walletService
  }

  /**
   * @description Get ME collection service object
   * @returns {CollectionService}
   */
  getCollectionService() {
    return this.#collectionService
  }
}
