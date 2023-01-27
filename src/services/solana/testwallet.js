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
  #currentServiceName = 'Test Wallet'
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
   * @param {Object} log_opts  - Log private key after creating account
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
    Logger.silly(
      this.#currentServiceName,
      `(${
        this.#network
      })[READY] Create test wallet with ${walletSolBalance} SOL airdrop`,
      log_opts.logPublicKey ? publicKey : null,
      log_opts.logPrivateKey ? secretKey : null
    )

    this.#transaction = new Transaction()
    const kp = Keypair.generate()
    const publicKey = kp.publicKey.toBase58()
    const secretKey = binary_to_base58(kp.secretKey)

    if (Object.values(log_opts).find((value) => value)) {
      Logger.silly(
        this.#currentServiceName,
        `(${this.#network})[SUCCESS] Created wallet data`,
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

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[SUCCESS] Received airdrop: ${walletSolBalance} SOL`,
      log_opts.logPublicKey ? publicKey.toBase58 : null
    )

    return response
  }

  /**
   * @description Receive SOL airdrop onto wallet
   * @param {String} walletAddress - Wallet address to receive SOL airdrop onto
   * @param {Number} solAmount  - SOL amount
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
    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[READY] Requesting airdrop`,
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

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[SUCCESS] Requesting airdrop`,
      walletAddress,
      solAmount
    )
  }

  /**
   * @description Fetch wallet SOL balance
   * @param {String} walletAddress - Wallet public key in String
   * @returns
   */
  async getWalletBalance(walletAddress, opts = { logBalance: false }) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      walletAddress,
      'Wallet address to get wallet balance of'
    )
    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[READY] Get balance for wallet address`,
      walletAddress
    )

    let balance =
      (await this.#connection.getBalance(new PublicKey(walletAddress))) /
      LAMPORTS_PER_SOL

    if (opts.logBalance) {
      Logger.silly(
        this.#currentServiceName,
        `(${this.#network})[READY] Get balance for wallet address`,
        walletAddress,
        balance
      )
    }
    return balance
  }
}
