import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import { LoggerTool } from '../../tools/logger-tool.js'

export class SolanaTransactionService {
  #connection
  #transaction
  #network
  #serviceName = 'Transaction'
  constructor(connection, network) {
    this.#connection = connection
    this.#network = network
  }

  /**
   * @description Send SOL from Sender to Receiver
   * @param {String} senderPublicKey - Sender account public key in String
   * @param {String} receiverPublicKey - Receiver account public key in String
   * @param {Object} opts - secretKeyByteArray -> Keypair of sender private key; solAmount -> amount to send (e.g. 0.015)
   * @returns
   */
  async transferSol(
    senderPublicKey,
    receiverPublicKey,
    opts = {
      secretKeyByteArray: undefined,
      solAmount: 0,
    }
  ) {
    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[READY] Transfer SOL: '${
        opts.solAmount
      }': \n-from '${senderPublicKey}'\n-to '${receiverPublicKey}'\n`
    )
    let senderKeyPairSecret = opts.secretKeyByteArray
    this.#transaction = new Transaction()
    this.#transaction.add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(senderPublicKey),
        toPubkey: new PublicKey(receiverPublicKey),
        lamports: LAMPORTS_PER_SOL * opts.solAmount,
      })
    )

    const response = await sendAndConfirmTransaction(
      this.#connection,
      this.#transaction,
      [senderKeyPairSecret]
    )

    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[SUCCESS] Transfer SOL: '${
        opts.solAmount
      }': \n-from '${senderPublicKey}'\n-to '${receiverPublicKey}'\n`
    )
    return response
  }
}
