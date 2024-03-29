import { Connection, clusterApiUrl } from '@solana/web3.js'
import { SolanaKeyPairService } from './keypair.js'
import { SolanaTransactionService } from './transaction.js'
import { Logger } from '../../tools/logger.js'
import { SolanaValidatorService } from './validator.js'
import { SolanaTestWalletService } from './testwallet.js'
import { ErrorHelper } from '../../helpers/error.js'

export class SolanaTestConnectionService {
  #connection
  #testAccountService
  #keyPairService
  #transactionService
  #network
  #currentServiceName = 'Connection'
  constructor(network) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      network,
      'Solana connection network'
    )
    SolanaValidatorService.validateTestNetwork(network)
    Logger.silly(
      this.#currentServiceName,
      `=== (${network}) Initialize network ${network} ===`,
      `(${network}) connection service`,
      `(${network}) wallet service`,
      `(${network}) keypair service`,
      `(${network}) transaction service`
    )
    this.#network = network
    this.#connection = new Connection(clusterApiUrl(this.#network))
    this.#testAccountService = new SolanaTestWalletService(this.#network)
    this.#keyPairService = new SolanaKeyPairService(this.#network)
    this.#transactionService = new SolanaTransactionService(
      this.#connection,
      this.#network
    )
  }

  /**
   * @description Get Solana wallet service object
   * @returns {SolanaTestWalletService}
   */
  getWalletTestService() {
    return this.#testAccountService
  }

  /**
   * @description Get Solana keypair service object
   * @returns {SolanaKeyPairService}
   */
  getKeyPairService() {
    return this.#keyPairService
  }

  /**
   * @description Get Solana transaction service object
   * @returns {SolanaTransactionService}
   */
  getTransactionService() {
    return this.#transactionService
  }
}
