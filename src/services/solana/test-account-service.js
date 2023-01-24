import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  Keypair,
  Transaction,
} from '@solana/web3.js'
import { binary_to_base58 } from 'base58-js'
import { LoggerTool } from '../../tools/logger-tool.js'
import { SolanaValidatorService } from './validator-service.js'

export class SolanaTestAccountService {
  #connection
  #transaction
  #serviceName = 'Test Account'
  #network
  constructor(network) {
    SolanaValidatorService.validateTestNetwork(network)
    this.#network = network
    this.#connection = new Connection(clusterApiUrl(network))
  }

  /**
   * @description Create test account with SOL airdrop receiving
   * @param {String} solBalance - Receive free airdrop in SOL on account after its creation
   * @param {Object} log_opts  - Print public and(-or) private key after creating account
   * @returns
   */
  async createTestAccountWithAirdrop(
    solBalance = 1,
    log_opts = {
      logPublicKey: false,
      logPrivateKey: false,
    }
  ) {
    LoggerTool.silly(
      this.#serviceName,
      `(${
        this.#network
      })[READY] Create test account with ${solBalance} SOL airdrop`,
      log_opts.logPublicKey ? publicKey : null,
      log_opts.logPrivateKey ? secretKey : null
    )

    this.#transaction = new Transaction()
    const kp = Keypair.generate()
    const publicKey = kp.publicKey.toBase58()
    const secretKey = binary_to_base58(kp.secretKey)

    if (Object.values(log_opts).find((value) => value)) {
      LoggerTool.silly(
        this.#serviceName,
        `(${this.#network})[SUCCESS] Created account data`,
        log_opts.logPublicKey ? publicKey : null,
        log_opts.logPrivateKey ? secretKey : null
      )
    }

    let response = await this.#connection.confirmTransaction(
      await this.#connection.requestAirdrop(
        kp.publicKey,
        LAMPORTS_PER_SOL * solBalance
      )
    )

    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[SUCCESS] Received airdrop: ${solBalance} SOL`,
      log_opts.logPublicKey ? publicKey.toBase58 : null
    )

    return response
  }

  async receiveSOLAirdrop(
    publicKeyString,
    solAmount,
    opts = { timeoutInMills: 15000 }
  ) {
    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[READY] Requesting airdrop`,
      publicKeyString,
      solAmount
    )

    if (solAmount >= 1) {
      for (let index = 0; index < solAmount; index++) {
        await this.#connection.confirmTransaction(
          await this.#connection.requestAirdrop(
            new PublicKey(publicKeyString),
            LAMPORTS_PER_SOL * solAmount
          )
        )
        if (solAmount > 1) {
          console.log('waiting')
          setTimeout(() => {}, opts.timeoutInMills)
        }
      }
    }

    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[SUCCESS] Requesting airdrop`,
      publicKeyString,
      solAmount
    )
  }

  /**
   * @description Fetch an account SOL balance
   * @param {String} publicKey - Account public key in String
   * @returns
   */
  async getBalance(publicKey, opts = { logBalance: false }) {
    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network}) Get account balance by public key`,
      publicKey
    )

    let balance =
      (await this.#connection.getBalance(new PublicKey(publicKey))) /
      LAMPORTS_PER_SOL

    if (opts.logBalance) {
      LoggerTool.silly(
        this.#serviceName,
        `(${this.#network}) Balance in sol`,
        publicKey,
        balance
      )
    }
    return balance
  }
}
