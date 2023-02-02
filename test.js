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
import axios from 'axios'
import { Environment } from './src/tools/env.js'
import { AxiosServiceHub } from './src/services/axios/hub.js'

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
  const parsedTransactions = []
  const parsed = await hub
    .getTransactionService()
    .getParsedTransactionBySignature(
      '4ahxWdgr3Pw2wBDxgta3rFCatzX1DQYj71PpmJa4eUoThDijF4dGWcZCw7dRenfS9cMmtaTD88AqrN1kSjpW3vcm'
    )
  // console.log(parsed.meta.innerInstructions[2]?.instructions[2])
  parsedTransactions.push(parsed)
  let parsedTransactionsS = parsedTransactions.filter(
    (parsedTransaction) =>
      !parsedTransaction?.meta?.postTokenBalances[0]?.mint?.startsWith(
        'So111111'
      ) &&
      parsedTransaction?.meta?.postTokenBalances[0]?.mint?.toString() &&
      parsedTransaction?.transaction?.message?.accountKeys?.find((acc) =>
        Object.values(dataObject.marketplacesAndPrograms).find(
          (marketProgram) => acc.pubkey.toBase58() == marketProgram
        )
      )
  )

  let parssss = parsedTransactionsS.filter((parsedTransaction) =>
    parsedTransaction?.meta?.innerInstructions?.find(
      (innerInstaction) =>
        !!innerInstaction?.instructions?.find(
          (instruction) =>
            instruction?.parsed?.info?.mint &&
            instruction?.program == 'spl-associated-token-account'
        )
    )
  )
  const isNFTSAle1 = await RunManager.isParsedTransactionNFTSale(
    parssss[0],
    dataObject,
    solanaHub
  )
  // console.log(parssss[0])
  console.log(isNFTSAle1)
  console.log(
    await solanaHub
      .getNFTService()
      .getNFTDataByMintAddress('73L6hQCyTaesCkcjTU9uvXyPtfkdbKz32H2CgXhjvhRs')
  )

  console.log(
    await solanaHub
      .getCandyMachineService()
      .getCandyMachineCreatorAddressByCandyMachineId(
        'CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb'
      )
  )
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
