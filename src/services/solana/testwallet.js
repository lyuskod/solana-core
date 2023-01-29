import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
  Keypair,
  Transaction,
} from '@solana/web3.js'
import { binary_to_base58 } from 'base58-js'
import { Logger } from '../../tools/logger.js'
import { SolanaValidatorService } from './validator.js'
import { ErrorHelper } from '../../helpers/error.js'

export class SolanaTestWalletService {
  #connection
  #transaction
  #currentServiceName = 'Solana Wallet Service'
  #network
  constructor(network) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(network, 'Solana test network')
    SolanaValidatorService.validateTestNetwork(network)
    this.#network = network
    this.#connection = new Connection(clusterApiUrl(network))
  }

  /**
   * @description Create test wallet with SOL airdrop receiving
   * @param {String} walletSolBalance - Wallet address to receive SOL onto
   * @param {Object} log_opts  - Log public key & private key after creating account
   * @returns
   */
  async createTestWalletWithAirdrop(
    walletSolBalance = 1,
    log_opts = {
      logPublicKey: false,
      logPrivateKey: false,
    }
  ) {
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(
      walletSolBalance,
      'Test wallet SOL balance to receive after creation'
    )
    ErrorHelper.throwErrorIfValueIsNegative(
      walletSolBalance,
      'Test wallet SOL balance to receive after creation'
    )
    Logger.ready(
      this.#currentServiceName,
      `(${
        this.#network
      }) Ready to create test wallet with ${walletSolBalance} SOL airdrop`,
      log_opts.logPublicKey ? publicKey : null,
      log_opts.logPrivateKey ? secretKey : null
    )

    this.#transaction = new Transaction()
    const kp = Keypair.generate()
    const publicKey = kp.publicKey.toBase58()
    const secretKey = binary_to_base58(kp.secretKey)

    if (Object.values(log_opts).find((value) => value)) {
      Logger.success(
        this.#currentServiceName,
        `(${this.#network}) Success to create test wallet`,
        log_opts.logPublicKey ? publicKey : null,
        log_opts.logPrivateKey ? secretKey : null
      )
    }

    let response = await this.#connection.confirmTransaction(
      await this.#connection.requestAirdrop(
        kp.publicKey,
        LAMPORTS_PER_SOL * walletSolBalance
      )
    )

    Logger.success(
      this.#currentServiceName,
      `(${
        this.#network
      }) Success to receive airdrop for test wallet: ${walletSolBalance} SOL`,
      log_opts.logPublicKey ? publicKey.toBase58 : null
    )

    return response
  }

  /**
   * @description Receive SOL airdrop onto wallet
   * @param {String} walletAddress - Wallet address to receive SOL airdrop onto
   * @param {Number} solAmount  - SOL amount
   * @param {Object} opts - Timeout in mills between airdropping if solAmount > 1
   * @returns
   */
  async receiveSOLAirdrop(
    walletAddress,
    solAmount,
    opts = { timeoutInMills: 15000 }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      'Test Wallet address to receive SOL airdrop'
    )
    ErrorHelper.throwErrorIfValueIsUndefinedOrNull(
      solAmount,
      'SOL Amount for airdrop'
    )
    ErrorHelper.throwErrorIfValueIsNegative(solAmount, 'SOL Amount for airdrop')
    Logger.ready(
      this.#currentServiceName,
      `(${this.#network}) Ready to request SOL airdrop`,
      walletAddress,
      solAmount
    )

    if (solAmount >= 1) {
      for (let index = 0; index < solAmount; index++) {
        await this.#connection.confirmTransaction(
          await this.#connection.requestAirdrop(
            new PublicKey(walletAddress),
            LAMPORTS_PER_SOL * solAmount
          )
        )
        if (solAmount > 1) {
          setTimeout(() => {}, opts.timeoutInMills)
        }
      }
    }

    Logger.success(
      this.#currentServiceName,
      `(${this.#network}) Success to receive SOL airdrop`,
      walletAddress,
      solAmount
    )
  }

  /**
   * @description Fetch wallet SOL balance
   * @param {String} walletAddress - Wallet public key in String
   * @param {Object} opts - Log balance
   * @returns
   */
  async getWalletBalance(walletAddress, opts = { logBalance: false }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      'Wallet address to get wallet balance of'
    )
    Logger.ready(
      this.#currentServiceName,
      `(${this.#network}) Ready to get balance for wallet address`,
      walletAddress
    )

    let balance =
      (await this.#connection.getBalance(new PublicKey(walletAddress))) /
      LAMPORTS_PER_SOL

    Logger.success(
      this.#currentServiceName,
      `(${this.#network}) Success to get balance for wallet address`,
      walletAddress,
      opts.logBalance ? balance : null
    )
    return balance
  }
}
