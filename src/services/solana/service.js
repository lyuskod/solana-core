import { Connection, clusterApiUrl } from '@solana/web3.js'
import { SolanaAccountService } from './account-service.js'
import { SolanaKeyPairService } from './keypair-service.js'
import { SolanaTransactionService } from './transaction-service.js'
import { LoggerTool } from '../../tools/logger-tool.js'
import { SolanaValidatorService } from './validator-service.js'
import { ErrorHelper } from '../../helpers/error-helper.js'
import { SolanaNFTSService } from './nfts-service.js'

export class SolanaConnectionService {
  #connection
  #accountService
  #keyPairService
  #transactionService
  #nftsService
  #network
  #serviceName = 'Connection'
  constructor(network) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(network)
    SolanaValidatorService.validateMainNetwork(network)
    LoggerTool.silly(
      this.#serviceName,
      `=== (${network}) Initialize network ${network} ===`,
      `(${network}) connection service`,
      `(${network}) account service`,
      `(${network}) keypair service`,
      `(${network}) transaction service`,
      `(${network}) nfts service`
    )
    this.#network = network
    this.#connection = new Connection(clusterApiUrl(network))
    this.#accountService = new SolanaAccountService(this.#connection)
    this.#keyPairService = new SolanaKeyPairService()
    this.#transactionService = new SolanaTransactionService(this.#connection)
    this.#nftsService = new SolanaNFTSService(this.#connection, network)
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

  getNFTsService(){
    return this.#nftsService
  }
}
