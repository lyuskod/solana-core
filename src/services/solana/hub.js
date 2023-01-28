import { Connection, clusterApiUrl } from '@solana/web3.js'
import { SolanaWalletService } from './wallet.js'
import { SolanaKeyPairService } from './keypair.js'
import { SolanaTransactionService } from './transaction.js'
import { Logger } from '../../tools/logger.js'
import { SolanaValidatorService } from './validator.js'
import { ErrorHelper } from '../../helpers/error.js'
import { SolanaNFTService } from './nft.js'

export class SolanaServiceHub {
  #connection
  #walletService
  #keyPairService
  #transactionService
  #nftService
  #network
  #currentServiceName = 'Connection'
  constructor(network) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      network,
      'Solana network for connection service'
    )
    SolanaValidatorService.validateNetwork(network)
    Logger.silly(
      this.#currentServiceName,
      `=== (${network}) Initialize network ${network} ===`,
      `(${network}) connection service`,
      `(${network}) wallet service`,
      `(${network}) keypair service`,
      `(${network}) transaction service`,
      `(${network}) nft service`
    )
    this.#network = network
    this.#connection = new Connection(clusterApiUrl(network))
    this.#walletService = new SolanaWalletService(this.#connection, network)
    this.#keyPairService = new SolanaKeyPairService(network)
    this.#transactionService = new SolanaTransactionService(this.#connection, network)
    this.#nftService = new SolanaNFTService(this.#connection, network)
  }

  /**
   * @description Get Solana wallet service object
   * @returns {SolanaWalletService}
   */
  getWalletService() {
    return this.#walletService
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

  /**
   * @description Get Solana nft service object
   * @returns {SolanaTransactionService}
   */
  getNFTService() {
    return this.#nftService
  }
}
