import { DTOContract } from '../../framework/contract/dto-contract.js'

export class CollectionModel extends DTOContract {
  constructor() {
    super()
    this.symbol = undefined
    this.name = undefined
    this.description = undefined
    this.image = undefined
    this.twitter = undefined
    this.discord = undefined
    this.website = undefined
    this.categories = undefined
    this.isBadged = undefined
    this.floorPrice = undefined
    this.listedCount = undefined
    this.volumeAll = undefined
  }

  /**
   *
   * @returns {CollectionModel}
   */
  cast(rawObject) {
    super.cast(rawObject)
    return this
  }
}
