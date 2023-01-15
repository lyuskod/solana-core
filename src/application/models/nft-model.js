import { DTOContract } from "../../framework/contract/dto-contract.js"

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
  }

  /**
   * 
   * @returns {NFTModel} 
   */
  cast(rawObject){
    super.cast(rawObject)
    return this
  }
}
