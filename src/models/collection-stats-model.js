import { DTOContract } from '../contract/dto-helper.js'

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
