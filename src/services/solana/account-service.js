import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { LoggerTool } from '../../tools/logger-tool.js'
import { SolanaTestAccountService } from './test-account-service.js'

export class SolanaAccountService {
  #connection
  #network
  #serviceName = 'Account'
  constructor(connection, network) {
    this.#network = network
    this.#connection = connection
  }

  /**
   * @description For testing purposes
   * @param {String} network - Cluster network. Works only for if network is 'devnet' or 'testnet'
   * @returns
   */
  sandbox(network) {
    return new SolanaTestAccountService(network)
  }

  /**
   * @description Fetch an account SOL balance
   * @param {String} publicKey - Account public key in String
   * @returns
   */
  async getBalance(publicKey, opts = { logBalance: false }) {
    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[READY] Get account balance by public key`,
      publicKey
    )

    let balance =
      (await this.#connection.getBalance(new PublicKey(publicKey))) /
      LAMPORTS_PER_SOL

    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[SUCCESS] Get account balance by public key`,
      publicKey,
      opts.logBalance ? balance : null
    )
    return balance
  }

  /**
   * @description Fetch an account info
   * @param {String} publicKey - Account public key in String
   * @returns
   */
  async getAccountInfo(publicKey, opts = { logAccountInfo: false }) {
    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[READY] Get account info by public key`,
      publicKey
    )

    let accountInfo = await this.#connection.getAccountInfo(
      new PublicKey(publicKey)
    )

    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[SUCCESS] Get account info by public key`,
      publicKey,
      opts.logAccountInfo ? accountInfo : null
    )

    return accountInfo
  }
}
