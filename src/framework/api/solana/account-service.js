import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { LoggerTool } from '../../tools/logger-tool.js'

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
  async getBalance(publicKey, opts = { logBalance: false }) {
    LoggerTool.silly(
      SolanaAccountService.name,
      'Get account balance by public key',
      publicKey
    )

    let balance =
      (await this.#connection.getBalance(new PublicKey(publicKey))) /
      LAMPORTS_PER_SOL

    if (opts.logBalance) {
      LoggerTool.silly(
        SolanaAccountService.name,
        `Balance in sol`,
        publicKey,
        balance
      )
    }
    return balance
  }

  /**
   * @description Fetch an account info
   * @param {String} publicKey - Account public key in String
   * @returns
   */
  async getAccountInfo(publicKey, opts = { logAccountInfo: false }) {
    LoggerTool.silly(
      SolanaAccountService.name,
      'Get account info by public key',
      publicKey
    )

    let accountInfo = await this.#connection.getAccountInfo(
      new PublicKey(publicKey)
    )
    if (opts.logAccountInfo) {
      LoggerTool.silly(
        SolanaAccountService.name,
        'Account info',
        publicKey, accountInfo
      )
    }

    return accountInfo;
  }
}
