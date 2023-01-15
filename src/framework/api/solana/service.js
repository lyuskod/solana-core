import { Connection, clusterApiUrl } from '@solana/web3.js'
import { SolanaAccountService } from './account-service.js'
import { KeyPairService } from './keypair-service.js'
import { SolanaTransactionService } from './transaction-service.js'

export class SolanaConnectionService {
  #connection
  #accountService
  #keyPairService
  #transactionService
  constructor(network) {
    this.#connection = new Connection(clusterApiUrl(network))
    this.#accountService = new SolanaAccountService(this.#connection)
    this.#keyPairService = new KeyPairService()
    this.#transactionService = new SolanaTransactionService(this.#connection)
  }

  getAccountService() {
    return this.#accountService
  }

  getKeyPairService(){
    return this.#keyPairService
  }

  getTransactionService(){
    return this.#transactionService
  }
}
