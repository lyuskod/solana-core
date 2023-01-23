import { Metaplex } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { LoggerTool } from '../../tools/logger-tool.js'

export class SolanaNFTSService {
  #connection
  #network
  #metaplex
  #serviceName = 'NFTs'
  constructor(connection, network) {
    this.#network = network
    this.#connection = connection
    this.#metaplex = new Metaplex(this.#connection)
  }

  async findByMintAddress(
    nftMintAddressString,
    log_opts = {
      logMetadata: false,
    }
  ) {
    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[READY] Get nft by nft's mint address`,
      nftMintAddressString
    )
    const nft = await this.#metaplex.nfts().findByMint({
      mintAddress: new PublicKey(nftMintAddressString),
    })
    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[SUCCESS] Get nft by nft's mint address`,
      nftMintAddressString,
      log_opts.logMetadata ? nft.json : null
    )
    return nft
  }
}
