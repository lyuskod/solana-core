import { NFTService } from './nft-service.js'
import { WalletService } from './wallet-service.js'
import { CollectionService } from './collection-service.js'
import { ErrorHelper } from '../../helpers/error-helper.js'

export class MEApiService {
  #nftService
  #walletService
  #collectionService
  #apiUrl

  constructor(apiUrl) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(apiUrl)
    this.#apiUrl = apiUrl
    this.#nftService = new NFTService(this.#apiUrl)
    this.#walletService = new WalletService(this.#apiUrl)
    this.#collectionService = new CollectionService(this.#apiUrl)
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
