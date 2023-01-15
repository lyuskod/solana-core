export class DTOContract {
  /**
   * @description Cast an object-like instance (in json format) into the class where this method was called from
   * @param {Object} rawObj - Object-like instance
   * @returns @class 
   */

  cast(rawObj) {
    for (let key in rawObj) this[key] = rawObj[key]
  }
}
