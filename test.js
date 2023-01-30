import { SolanaServiceHub } from './src/services/solana/hub.js'
import { MagicEdenServiceHub } from './src/services/me/hub.js'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from '@metaplex-foundation/js'
import fs from 'fs'
import { RunManager } from './bot/helpers/manager.js'
import { Logger } from './src/tools/logger.js'

const f = async () => {
  RunManager.killProgramIfMainDataIsNotInitialized(
    'COLLECTION_ADDRESS',
    'POLLING_INTERWALL_IN_MILLS'
  )
  const dataObject = RunManager.getMainDataObject()
  const solanaHub = new SolanaServiceHub('mainnet-beta')
  const con = new Connection(clusterApiUrl('mainnet-beta'))

  const hub = new SolanaServiceHub('mainnet-beta')
  const me = new MagicEdenServiceHub('https://api-mainnet.magiceden.dev/v2')
  const parsed = await hub
    .getTransactionService()
    .getParsedTransactionBySignature(
      'X6CSvzQeQ78KnF4wtxo6SZywmXfMPiFPrJr1ft52Y6DQWcnGePCuohuzHhzb7HwxnHCF8UHiBjVW71sNk6mA5JW'
    )
  console.log(dataObject)
  const s = await RunManager.isParsedTransactionNFTSale(parsed, dataObject, hub)
    console.log(s)
  // const s = await new Metaplex(new Connection(clusterApiUrl('mainnet-beta')))
  //   .nfts()
  //   .findByMint({
  //     mintAddress: new PublicKey('5RviMG3bQ4xT8mqx6XqT51XY3zmafLVTPLqcX2iZCKQW')
  //   })
  // console.log(s)
}
Logger.manage({ level: 'info' })
f()
