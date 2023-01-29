import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Keypair,
} from '@solana/web3.js'
import { base58_to_binary } from 'base58-js'
import _ from 'lodash'
import { timer } from '../../../bot/helpers/manager.js'
import { ErrorHelper } from '../../helpers/error.js'
import { Logger } from '../../tools/logger.js'
import { SolanaValidatorService } from './validator.js'

export class SolanaTransactionService {
  #connection
  #transaction
  #network
  #currentServiceName = 'Transaction'
  constructor(connection, network) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      connection,
      'Solana connection for transaction service'
    )
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      network,
      'Solana network for transaction service'
    )
    SolanaValidatorService.validateNetwork(network)
    this.#connection = connection
    this.#network = network
  }

  /**
   * @description Send SOL from Sender to Receiver
   * @param {String} senderWalletPrivateKey - Sender private key in UInt8Array (Public key will be generated based on provided private key)
   * @param {String} receiverWalletAddress - Receiver wallet address in String
   * @param {Number} solAmount - Amount in SOL to send
   * @returns
   */
  async transferSol(senderWalletPrivateKey, receiverWalletAddress, solAmount) {
    let senderKeyPairSecret = Keypair.fromSecretKey(
      base58_to_binary(senderWalletPrivateKey)
    )
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      senderWalletPrivateKey,
      'Sender private key for transfering SOL'
    )
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      receiverWalletAddress,
      'Receiver wallet address for receiving SOL'
    )
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(
      solAmount,
      'SOL amount to send'
    )
    ErrorHelper.throwErrorIfValueIsNegative(solAmount, 'SOL amount to send')
    Logger.ready(
      this.#currentServiceName,
      `(${
        this.#network
      }) Ready to transfer SOL: '${solAmount}': \n-from '${senderKeyPairSecret.publicKey.toBase58()}'\n-to '${receiverWalletAddress}'\n`
    )

    this.#transaction = new Transaction()
    this.#transaction.add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(senderKeyPairSecret.publicKey.toBase58()),
        toPubkey: new PublicKey(receiverWalletAddress),
        lamports: LAMPORTS_PER_SOL * opts.solAmount,
      })
    )

    const response = await sendAndConfirmTransaction(
      this.#connection,
      this.#transaction,
      [senderKeyPairSecret]
    )

    Logger.success(
      this.#currentServiceName,
      `(${this.#network}) Success to transfer SOL: '${
        opts.solAmount
      }': \n-from '${senderWalletAddress}'\n-to '${receiverWalletAddress}'\n`
    )
    return response
  }

  /**
   * @description Get confirmed blockchain transactions by address
   * @param {String} address - Address to get confirmed transactions of
   * @param {Object} opts - Additional parameters
   * @returns {Array<any>}
   */
  async getConfirmedSignaturesForAddress(
    address,
    opts = {
      beforeTransaction: undefined,
      untilTransaction: undefined,
      limit: 1000,
      commitment: 'finalized',
      logConfirmedTransactions: false,
    }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      address,
      'Address for confirmed transactions'
    )
    ErrorHelper.throwErrorIfArrayIsEmptyOrNullOrUndefined(
      opts.limit,
      'Confirmed transactions limit'
    )
    ErrorHelper.throwErrorIfValueIsNegative(
      opts.limit,
      'Confirmed transactions limit'
    )

    const addressPublicKey = new PublicKey(address)
    let confirmedTransactions = null

    Logger.ready(
      this.#currentServiceName,
      `(${
        this.#network
      }) Ready to get confirmed transactions of provided address`,
      address
    )

    try {
      confirmedTransactions =
        await this.#connection.getConfirmedSignaturesForAddress2(
          addressPublicKey,
          {
            before: opts.beforeTransaction,
            until: opts.untilTransaction,
            limit: opts.limit,
          },
          opts.commitment
        )

      if (confirmedTransactions.length == 0) {
        throw new Error()
      }

      Logger.success(
        this.#currentServiceName,
        `(${
          this.#network
        }) Success to get confirmed transactions of provided address`,
        address,
        opts.logConfirmedTransactions ? confirmedTransactions : null
      )
    } catch (e) {
      Logger.warn(
        this.#currentServiceName,
        `(${
          this.#network
        }) Get confirmed transactions returned []. It can be 0 transactions or address is not valid`,
        address
      )
      confirmedTransactions = []
    }

    return confirmedTransactions
  }

  /**
   * @description Collects the 'signature' field of every transaction from confirmed transactions array
   * @param {Array<any>} confirmedTransactions - Array of confirmed transactions data
   * @returns {Array<String>}
   */
  collectConfirmedTransactionsSignatures(confirmedTransactions) {
    ErrorHelper.throwErrorIfArrayIsEmptyOrNullOrUndefined(
      confirmedTransactions,
      'Confirmed transactions array to collect signatures from'
    )
    return confirmedTransactions.map((transaction) => transaction.signature)
  }

  /**
   * @description - Get parsed data of transaction by transaction signature
   * @param {String} signature - Signature hash in String
   * @param {Object} log_opts - Log parsed transaction data
   * @returns {JSON}
   */
  async getParsedTransactionBySignature(
    signature,
    log_opts = { logParsedTransactionData: false }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      signature,
      'Signature to get transaction by'
    )

    Logger.ready(
      this.#currentServiceName,
      `(${
        this.#network
      }) Ready to get parsed data of provided transaction by transaction signature`,
      signature
    )

    let transaction = await this.#connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    })

    Logger.success(
      this.#currentServiceName,
      `(${
        this.#network
      }) Ready to get parsed data of provided transaction by transaction signature`,
      signature,
      log_opts.logParsedTransactionData ? transaction : null
    )
    return transaction
  }

  /**
   * @description - Get the most recent transaction for address
   * @param {String} address - Wallet/account address in String
   * @param {Object} log_opts - Log the most recent transaction data
   * @returns {JSON}
   */
  async getTheMostRecentTransactionForAddress(
    address,
    log_opts = {
      logTheMostRecentTransactionData: false,
    }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      address,
      'Address to get the most recent transaction of'
    )

    Logger.ready(
      this.#currentServiceName,
      `(${
        this.#network
      }) Ready to get the most resent transaction data of provided address`,
      address
    )

    const addressPublicKeyKey = new PublicKey(address)
    let transactions = await this.#connection.getConfirmedSignaturesForAddress2(
      addressPublicKeyKey,
      {
        limit: 1,
      }
    )

    if (!transactions.length || !transactions.err == null) {
      Logger.warn(
        this.#currentServiceName,
        `(${
          this.#network
        }) The most recent transaction is not found or received a transaction that are not completed on blockchain due some error. Retrying...`,
        address
      )
      await timer(500)
      this.getTheMostRecentTransactionForAddress(address)
    }

    Logger.success(
      this.#currentServiceName,
      `(${
        this.#network
      }) Success to get the most resent transaction data of provided address`,
      {
        address: address,
        signature: transactions[0].signature,
      },
      log_opts.logTheMostRecentTransactionData ? transactions[0] : null
    )

    return transactions[0]
  }

  /**
   * @description Get transactions that are new (appeared) after provided transaction
   * @param {String} address - Wallet address
   * @param {String} afterSignature - Transaction hash in String
   * @returns {Array<JSON>}
   */
  async getTransactionsGoingAfterTransaction(
    address,
    afterSignature,
    log_opts = {
      logNewTransactions: false,
    }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      address,
      'Address to get transactions that goes after corresponding one'
    )

    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      afterSignature,
      'Signature to get transactions that goes after one'
    )

    Logger.ready(
      this.#currentServiceName,
      `(${
        this.#network
      }) Ready to get new transactions appeared after provided one`,
      {
        address,
        afterSignature,
      }
    )

    let transactions = []
    const addressPublicKeyKey = new PublicKey(address)
    transactions = await this.#connection.getConfirmedSignaturesForAddress2(
      addressPublicKeyKey,
      {
        until: afterSignature,
      }
    )
    if (transactions.length == 0) return []

    transactions = transactions.filter((transaction) => transaction.err == null)

    Logger.success(
      this.#currentServiceName,
      `(${
        this.#network
      }) Success to get new transactions appeared after provided one`,
      {
        address,
        afterSignature,
        transactionsCount: transactions.length,
      },
      log_opts.logNewTransactions ? transactions : null
    )

    return transactions
  }
}
