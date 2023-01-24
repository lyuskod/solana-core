import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Keypair,
  Transaction,
  SystemProgram,
} from '@solana/web3.js'
import { NATIVE_MINT, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { LoggerTool } from '../../tools/logger-tool.js'
import { SolanaTestAccountService } from './test-account-service.js'
import { base58_to_binary, binary_to_base58 } from 'base58-js'
import { ACCOUNT_SIZE } from '@solana/spl-token'
import { getMinimumBalanceForRentExemptAccount } from '@solana/spl-token'
import { createInitializeAccountInstruction } from '@solana/spl-token'

export class SolanaAccountService {
  #connection
  #network
  #serviceName = 'Account'
  constructor(connection, network) {
    this.#network = network
    this.#connection = connection
  }

  async createRandomAccount(
    feePayerPrivateKey,
    log_opts = { logCreatedAccount: false }
  ) {
    let feePayerKeyPair = Keypair.fromSecretKey(
      base58_to_binary(feePayerPrivateKey)
    )
    let newAccountKeyPair = Keypair.generate()

    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[READY] Create random account`,
      log_opts.logCreatedAccount
        ? [
            [
              'New data',
              newAccountKeyPair.publicKey.toBase58(),
              binary_to_base58(newAccountKeyPair.secretKey),
            ],
            [
              'Fee payer data',
              feePayerKeyPair.publicKey.toBase58(),
              feePayerPrivateKey,
            ],
          ]
        : null
    )
    const transaction = new Transaction()
    const lamports = await getMinimumBalanceForRentExemptAccount(
      this.#connection
    )
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: feePayerKeyPair.publicKey,
        newAccountPubkey: newAccountKeyPair.publicKey,
        space: ACCOUNT_SIZE,
        lamports: lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      SystemProgram.transfer({
        fromPubkey: feePayerKeyPair.publicKey,
        toPubkey: newAccountKeyPair.publicKey,
        lamports: lamports,
      })
    )

    const response = await this.#connection.sendTransaction(transaction, [
      feePayerKeyPair,
      newAccountKeyPair,
    ])

    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[SUCCESS] Created random account`,
      log_opts.logCreatedAccount
        ? [
            newAccountKeyPair.publicKey.toBase58(),
            binary_to_base58(newAccountKeyPair.secretKey),
          ]
        : null
    )
  }

  /**
   * @description For testing purposes
   * @param {String} network - Cluster network. Works only for if network is 'devnet' or 'testnet'
   * @returns
   */
  sandbox(network) {
    return new SolanaTestAccountService(network)
  }

  /**
   * @description Fetch an account SOL balance
   * @param {String} publicKey - Account public key in String
   * @returns
   */
  async getBalance(publicKey, opts = { logBalance: false }) {
    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[READY] Get account balance by public key`,
      publicKey
    )

    let balance =
      (await this.#connection.getBalance(new PublicKey(publicKey))) /
      LAMPORTS_PER_SOL

    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[SUCCESS] Get account balance by public key`,
      publicKey,
      opts.logBalance ? balance : null
    )
    return balance
  }

  /**
   * @description Fetch an account info
   * @param {String} publicKey - Account public key in String
   * @returns
   */
  async getAccountInfo(publicKey, opts = { logAccountInfo: false }) {
    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[READY] Get account info by public key`,
      publicKey
    )

    let accountInfo = await this.#connection.getAccountInfo(
      new PublicKey(publicKey)
    )

    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[SUCCESS] Get account info by public key`,
      publicKey,
      opts.logAccountInfo ? accountInfo : null
    )

    return accountInfo
  }
}
