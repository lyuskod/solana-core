import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Keypair,
  Connection,
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
    Logger.silly(
      this.#currentServiceName,
      `(${
        this.#network
      })[READY] Transfer SOL: '${solAmount}': \n-from '${senderKeyPairSecret.publicKey.toBase58()}'\n-to '${receiverWalletAddress}'\n`
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

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[SUCCESS] Transfer SOL: '${
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

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[READY] Get confirmed transactions for address`,
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

      Logger.silly(
        this.#currentServiceName,
        `(${this.#network})[SUCCESS] Get confirmed transactions for address`,
        address,
        opts.logConfirmedTransactions ? confirmedTransactions : null
      )
    } catch (e) {
      Logger.silly(
        this.#currentServiceName,
        `(${
          this.#network
        })[WARN] Get confirmed transactions returned []. It can be 0 transactions or address is not valid`,
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

  async getParsedTransactionBySignature(signature) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      signature,
      'Signature to get transaction by'
    )

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[READY] Get transaction by signature`,
      signature
    )

    let transaction = await this.#connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    })
    return transaction
  }

  async getTheMostRecentTransactionForAddress(address) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      address,
      'Address to get the most recent transaction of'
    )

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[READY] Get the most resent transaction of address`,
      address
    )

    const addressPublicKeyKey = new PublicKey(address)
    let transactions = await this.#connection.getConfirmedSignaturesForAddress2(
      addressPublicKeyKey,
      {
        limit: 3,
      },
      'finalized'
    )

    console.log(transactions)
    if (!transactions.length) {
      Logger.silly(
        this.#currentServiceName,
        `(${
          this.#network
        })[WARN] Get the most resent transaction method was not found recent transaction by address. Retrying...`,
        address
      )
      await timer(500)
      this.getTheMostRecentTransactionForAddress(address)
    }

    let filtered = transactions.filter((transaction) => transaction.err == null)

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[SUCCESS] Get the most resent transaction of address`,
      {
        address: address,
        signature: transactions[0].signature,
      }
    )

    return transactions[transactions.length - 1]
  }

  async getTransactionsGoingAfterTransaction(address, afterSignature) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      address,
      'Address to get transactions that goes after corresponding one'
    )

    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      afterSignature,
      'Signature to get transactions that goes after one'
    )

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[READY] Get transactions going after provided one`,
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

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network}) Get transactions going after provided one`,
      {
        address,
        afterSignature,
        transactionsCount: transactions.length,
      }
    )

    return transactions
  }
}
