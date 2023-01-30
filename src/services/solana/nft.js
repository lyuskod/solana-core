import { Metaplex } from '@metaplex-foundation/js'
import { clusterApiUrl, PublicKey } from '@solana/web3.js'
import { Logger } from '../../tools/logger.js'
import { ErrorHelper } from '../../helpers/error.js'
import { SolanaValidatorService } from './validator.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection } from '@solana/web3.js/lib/index.cjs.js'

export class SolanaNFTService {
  #connection
  #network
  #metaplex
  #currentServiceName = 'Solana NFT Service'
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
    this.#metaplex = new Metaplex(this.#connection)
  }

  /**
   * @description Get nft data by nft mint address
   * @param {String} nftMintAddress - Mint address of NFT
   * @param {Boolean} log_opts - Log fetched NFT metadata
   * @returns {JSON}
   */
  async getNFTDataByMintAddress(
    nftMintAddress,
    log_opts = {
      logNFTMetadata: false,
    }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      nftMintAddress,
      'NFT mint adress to get data of'
    )
    Logger.ready(
      this.#currentServiceName,
      `(${this.#network}) Ready to get nft metadata by nft's mint address`,
      nftMintAddress
    )
    const nft = await this.#metaplex.nfts().findByMint({
      mintAddress: new PublicKey(nftMintAddress),
    })
    Logger.success(
      this.#currentServiceName,
      `(${this.#network}) Success to get nft metadata by nft's mint address`,
      nftMintAddress,
      log_opts.logNFTMetadata ? nft.json : null
    )
    return nft
  }

  async getOwnedNftsByWallet(walletAddress) {
    const objectArray = (
      await this.#connection.getParsedTokenAccountsByOwner(
        new PublicKey(walletAddress),
        {
          programId: TOKEN_PROGRAM_ID,
        }
      )
    ).value

    const collectedNFTMintAddresses = objectArray.map(
      (obj) => obj.account.data.parsed.info.mint
    )

    const nfts = []
    for (let nftMintAddress of collectedNFTMintAddresses) {
      nfts.push(await this.getNFTDataByMintAddress(nftMintAddress))
    }

    return nfts
  }
}
