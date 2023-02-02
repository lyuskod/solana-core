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
  const notNFTSaleTxId =
    '5o9U4acaMt63VLL88XZ8fvarf1ByfodzRKgUhbiAvWhF2sA5s9urpL2daX5q4DeQdtLySstVTP2nwpeyjJGE1QiP'
  const NFTSaleTXId =
    '3CrSxfpmTWY1kABgjVyZ1uSewFoPaWmFTY1VgnGepjU5sW7CeRKcrhiLJpwDEVhn2z8y4h57B8MKMuatDqyk2otf'
  const transacts = []
  const parsed = await hub
    .getTransactionService()
    .getParsedTransactionBySignature(NFTSaleTXId)
  // console.log(parsed.meta.innerInstructions[2]?.instructions[2])
  transacts.push(parsed)
  const isFound = !!transacts.find(
    (parsedTransaction) =>
      !!parsedTransaction?.meta?.innerInstructions?.find(
        (innerInstaction) =>
          !!innerInstaction?.instructions.find(
            (instruction) =>
              instruction?.parsed?.info?.mint &&
              instruction?.program == 'spl-associated-token-account'
          )
      )
  )
  console.log(isFound)
  // console.log(parsed.meta.innerInstructions[2]?.instructions[2]?.parsed?.info?.mint)
  // console.log(parsed.meta.innerInstructions[0]?.instructions?.parsed?.type == 'transfer')
  // console.log(parsed.meta.innerInstructions[1].instructions.type == 'createAccount')
  // console.log(parsed.meta.innerInstructions[2].instructions)
  // const s = await new Metaplex(new Connection(clusterApiUrl('mainnet-beta')))
  //   .nfts()
  //   .findByMint({
  //     mintAddress: new PublicKey('5RviMG3bQ4xT8mqx6XqT51XY3zmafLVTPLqcX2iZCKQW')
  //   })
  // console.log(s)
}
Logger.manage({ level: 'info' })
f()
