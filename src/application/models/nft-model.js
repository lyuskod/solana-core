import { DTOContract } from '../../framework/contract/dto-contract.js'

export class NFTModel extends DTOContract {
  constructor() {
    super()
    this.mintAddress = undefined
    this.owner = undefined
    this.supply = undefined
    this.collection = undefined
    this.name = undefined
    this.updateAuthority = undefined
    this.primarySaleHappened = undefined
    this.sellerFeeBasisPoints = undefined
    this.image = undefined
    this.externalUrl = undefined
    this.attributes = undefined
    this.properties = undefined
    this.price = undefined
    this.listStatus = undefined
    this.tokenAddress = undefined
  }

  /**
   *
   * @returns {NFTModel}
   */
  cast(rawObject) {
    return super.cast(rawObject, NFTModel)
  }

   /**
   *
   * @returns {Array<NFTModel>}
   */
  castAll(rawObject) {
    return super.castAll(rawObject, NFTModel)
  }
}
