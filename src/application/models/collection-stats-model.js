import { DTOContract } from '../../framework/contract/dto-contract.js'

export class CollectionStatsModel extends DTOContract {
  constructor() {
    super()
    this.symbol = undefined
    this.floorPrice = undefined
    this.listedCount = undefined
    this.volumeAll = undefined
  }

  /**
   *
   * @returns {CollectionStatsModel}
   */
  cast(rawObject) {
    return super.cast(rawObject, CollectionStatsModel)
  }
}
