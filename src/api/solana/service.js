import { Connection, clusterApiUrl } from '@solana/web3.js'
import { SolanaAccountService } from './account-service.js'
import { KeyPairService } from './keypair-service.js'
import { SolanaTransactionService } from './transaction-service.js'
import { LoggerTool } from '../../tools/logger-tool.js'
import { SolanaValidatorService } from './validator-service.js'

export class SolanaConnectionService {
  #connection
  #accountService
  #keyPairService
  #transactionService
  #network
  #serviceName = "Connection"
  constructor(network) {
    SolanaValidatorService.validateMainNetwork(network)
    LoggerTool.silly(
      this.#serviceName,
      `=== (${network}) Initialize network ${network} ===`,
      `(${network}) connection service`,
      `(${network})account service`,
      `(${network}) keypair service`,
      `(${network}) transaction service`
    )
    this.#network = network
    this.#connection = new Connection(clusterApiUrl(network))
    this.#accountService = new SolanaAccountService(this.#connection)
    this.#keyPairService = new KeyPairService()
    this.#transactionService = new SolanaTransactionService(this.#connection)
  }

  getAccountService() {
    return this.#accountService
  }

  getKeyPairService() {
    return this.#keyPairService
  }

  getTransactionService() {
    return this.#transactionService
  }
}
