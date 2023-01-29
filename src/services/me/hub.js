import { MagicEdenNFTService } from './nft.js'
import { MagicEdenWalletService } from './wallet.js'
import { MagicEdenCollectionService } from './collection.js'
import { ErrorHelper } from '../../helpers/error.js'
import { Logger } from '../../tools/logger.js'

export class MagicEdenServiceHub {
  #apiUrl
  #nftServiceInstance
  #walletServiceInstance
  #collectionServiceInstance
  #currentServiceName = 'ME Connection'
  constructor(apiUrl) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(apiUrl, 'ME Hub API Url')
    ErrorHelper.throwErrorIfValueIsNotURL(apiUrl, 'ME Hub API Url')
    Logger.success(
      this.#currentServiceName,
      `=== Initialize network ${apiUrl} ===`,
      '=== initialize ME NFT Service',
      '=== initialize ME Wallet Service',
      '=== initialize ME Collection Service'
    )
    this.#apiUrl = apiUrl
    this.#nftServiceInstance = new MagicEdenNFTService(this.#apiUrl)
    this.#walletServiceInstance = new MagicEdenWalletService(this.#apiUrl)
    this.#collectionServiceInstance = new MagicEdenCollectionService(
      this.#apiUrl
    )
  }

  /**
   * @description Get ME nft service object
   * @returns {MagicEdenNFTService}
   */
  getNFTService() {
    return this.#nftServiceInstance
  }

  /**
   * @description Get ME wallet service object
   * @returns {MagicEdenWalletService}
   */
  getWalletService() {
    return this.#walletServiceInstance
  }

  /**
   * @description Get ME collection service object
   * @returns {MagicEdenCollectionService}
   */
  getCollectionService() {
    return this.#collectionServiceInstance
  }
}
