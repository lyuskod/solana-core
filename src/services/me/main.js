import { MagicEdenNFTService } from './nft.js'
import { MagicEdenWalletService } from './wallet.js'
import { MagicEdenCollectionService } from './collection.js'
import { ErrorHelper } from '../../helpers/error-helper.js'

export class MagicEdenMainService {
  #nftService
  #walletService
  #collectionService
  #apiUrl

  constructor(apiUrl) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(apiUrl)
    this.#apiUrl = apiUrl
    this.#nftService = new MagicEdenNFTService(this.#apiUrl)
    this.#walletService = new MagicEdenWalletService(this.#apiUrl)
    this.#collectionService = new MagicEdenCollectionService(this.#apiUrl)
  }

  /**
   * @description Get ME nft service object
   * @returns {MagicEdenNFTService}
   */
  getNFTService() {
    return this.#nftService
  }

  /**
   * @description Get ME wallet service object
   * @returns {MagicEdenWalletService}
   */
  getWalletService() {
    return this.#walletService
  }

  /**
   * @description Get ME collection service object
   * @returns {MagicEdenCollectionService}
   */
  getCollectionService() {
    return this.#collectionService
  }
}
