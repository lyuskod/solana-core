import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Keypair,
  Transaction,
  SystemProgram,
} from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Logger } from '../../tools/logger.js'
import { SolanaWalletService } from './testwallet.js'
import { base58_to_binary, binary_to_base58 } from 'base58-js'
import { ACCOUNT_SIZE } from '@solana/spl-token'
import { getMinimumBalanceForRentExemptAccount } from '@solana/spl-token'
import { ErrorHelper } from '../../helpers/error.js'
import { SolanaValidatorService } from './validator.js'

export class SolanaWalletService {
  #connection
  #network
  #currentServiceName = 'Wallet'
  constructor(connection, network) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      connection,
      'Solana connection for wallet service'
    )
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      network,
      'Solana network for wallet service'
    )
    SolanaValidatorService.validateNetwork(network)
    this.#network = network
    this.#connection = connection
  }

  /**
   * @description Creates and initialize a wallet on blockchain with random keypair having minimum solana balance
   * @param {String} feePayerPrivateKey - Fee payer private key in String
   * @param {Object} log_opts - Log created account public & private keys
   * @returns {Keypair}
   */
  async createRandomWallet(
    feePayerPrivateKey,
    log_opts = { logCreatedWalletData: false }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      feePayerKeyPair,
      'Fee payer private key to create random wallet'
    )
    let feePayerKeyPair = Keypair.fromSecretKey(
      base58_to_binary(feePayerPrivateKey)
    )
    let newWalletKeyPair = Keypair.generate()

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[READY] Create random wallet`,
      log_opts.logCreatedWalletData
        ? [
            [
              'New wallet data',
              newWalletKeyPair.publicKey.toBase58(),
              binary_to_base58(newWalletKeyPair.secretKey),
            ],
            [
              'Fee payer wallet data',
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
        newAccountPubkey: newWalletKeyPair.publicKey,
        space: ACCOUNT_SIZE,
        lamports: lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      SystemProgram.transfer({
        fromPubkey: feePayerKeyPair.publicKey,
        toPubkey: newWalletKeyPair.publicKey,
        lamports: lamports,
      })
    )

    await this.#connection.sendTransaction(transaction, [
      feePayerKeyPair,
      newWalletKeyPair,
    ])

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[SUCCESS] Create random wallet`,
      log_opts.logCreatedWalletData
        ? [
            [
              'New wallet data',
              newWalletKeyPair.publicKey.toBase58(),
              binary_to_base58(newWalletKeyPair.secretKey),
            ],
            [
              'Fee payer wallet data',
              feePayerKeyPair.publicKey.toBase58(),
              feePayerPrivateKey,
            ],
          ]
        : null
    )

    return newWalletKeyPair
  }

  /**
   * @description For testing purposes
   * @param {String} network - Cluster network. Works only for if network is 'devnet' or 'testnet'
   * @returns
   */
  sandbox(network) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      network,
      'Solana network for testing'
    )
    SolanaValidatorService.validateTestNetwork(network)
    return new SolanaWalletService(network)
  }

  /**
   * @description Fetch wallet's SOL balance
   * @param {String} walletAddress - Wallet address in String
   * @returns
   */
  async getBalance(walletAddress) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      'Wallet address to get balance of'
    )

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[READY] Get wallet balance by public key`,
      walletAddress
    )

    let walletBalance =
      (await this.#connection.getBalance(new PublicKey(walletAddress))) /
      LAMPORTS_PER_SOL

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[SUCCESS] Get wallet balance by public key`,
      walletAddress,
      walletBalance
    )
    return walletBalance
  }

  /**
   * @description Fetch wallet info
   * @param {String} walletAddress - Wallet address in String
   * @returns
   */
  async getWalletInfo(walletAddress, opts = { logWalletInfo: false }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      'Wallet address to get wallet info of'
    )
    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[READY] Get wallet info by public key`,
      walletAddress
    )

    let walletInfo = await this.#connection.getAccountInfo(
      new PublicKey(walletAddress)
    )

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[SUCCESS] Get wallet info by public key`,
      walletAddress,
      opts.logWalletInfo ? walletInfo : null
    )

    return walletInfo
  }
}
