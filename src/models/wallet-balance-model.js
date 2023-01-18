import { DTOContract } from '../contract/dto-contract.js'

export class WalletBalanceModel extends DTOContract {
  constructor() {
    super()
    this.buyerEscrow = undefined
    this.balance = undefined
  }

  /**
   *
   * @returns {WalletBalanceModel}
   */
  cast(rawObject) {
    return super.cast(rawObject, WalletBalanceModel)
  }
}
