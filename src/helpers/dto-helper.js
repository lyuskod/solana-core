import _ from 'lodash'
export class DTOContract {
  /**
   * @description Cast an object-like instance (in json format) into the class (constructor)
   * @param {Object} rawObj - Object-like instance
   * @param {Object} constructor - Class to cast rawObject into
   * @returns @class
   */
  cast(rawObj, constructor) {
    let obj = new constructor()
    for (let key in rawObj) obj[key] = _.cloneDeep(rawObj[key])
    return obj
  }

  /**
   * @description Cast an object-like instance (in json format) into the Array<T>. T is a constructor
   * @param {Object} rawObject - Object-like instance
   * @param {Object} constructor - Class to cast rawObject into
   * @returns 
   */
  castAll(rawObject, constructor) {
    return rawObject.map((nftObject) => this.cast(nftObject, constructor))
  }
}
