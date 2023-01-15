import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

export class SolanaAccountService {
  #connection
  constructor(connection) {
    this.#connection = connection
  }

  /**
   * @description Fetch an account SOL balance
   * @param {String} publicKey - Account public key in String
   * @returns
   */
  async getBalance(publicKey) {
    return (
      (await this.#connection.getBalance(new PublicKey(publicKey))) /
      LAMPORTS_PER_SOL
    )
  }

  /**
   * @description Fetch an account info
   * @param {String} publicKey - Account public key in String
   * @returns
   */
  async getAccountInfo(publicKey) {
    return await this.#connection.getAccountInfo(new PublicKey(publicKey))
  }
}
