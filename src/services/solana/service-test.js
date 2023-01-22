import { Connection, clusterApiUrl } from '@solana/web3.js'
import { SolanaAccountService } from './account-service.js'
import { KeyPairService } from './keypair-service.js'
import { SolanaTransactionService } from './transaction-service.js'
import { LoggerTool } from '../../tools/logger-tool.js'
import { SolanaValidatorService } from './validator-service.js'
import { SolanaTestAccountService } from './test-account-service.js'

export class SolanaTestConnectionService {
  #connection
  #accountService
  #keyPairService
  #transactionService
  #network
  #serviceName = 'Connection'
  constructor(network) {
    SolanaValidatorService.validateTestNetwork(network)
    LoggerTool.silly(
      this.#serviceName,
      `=== (${network}) Initialize network ${network} ===`,
      `(${network}) connection service`,
      `(${network}) account service`,
      `(${network}) keypair service`,
      `(${network}) transaction service`
    )
    this.#network = network
    this.#connection = new Connection(clusterApiUrl(this.#network))
    this.#accountService = new SolanaTestAccountService(this.#network)
    this.#keyPairService = new KeyPairService(this.#network)
    this.#transactionService = new SolanaTransactionService(
      this.#connection,
      this.#network
    )
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
