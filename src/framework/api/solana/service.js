import { Connection, clusterApiUrl } from '@solana/web3.js'
import { SolanaAccountService } from './account-service.js'
import { KeyPairService } from './keypair-service.js'
import { SolanaTransactionService } from './transaction-service.js'
import { LoggerTool } from '../../tools/logger-tool.js'

export class SolanaConnectionService {
  #connection
  #accountService
  #keyPairService
  #transactionService
  #network
  constructor(network) {
    LoggerTool.silly(
      SolanaConnectionService.name,
      `Initialize network ${network}`,
      'connection service',
      'account service',
      'keypair service',
      'transaction service'
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
