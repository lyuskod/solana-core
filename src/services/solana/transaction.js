import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Keypair,
} from '@solana/web3.js'
import { base58_to_binary } from 'base58-js'
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
}
