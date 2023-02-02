import * as dotenv from 'dotenv'
import { SolanaServiceHub } from '../src/services/solana/hub.js'
import { Logger } from '../src/tools/logger.js'
import { RunManager } from './helpers/manager.js'
import { timer } from '../bot/helpers/manager.js'
import { Parser } from './helpers/parser.js'
import fs from 'fs'
import { Connection } from '@solana/web3.js/lib/index.cjs.js'
import { clusterApiUrl } from '@solana/web3.js'
import _ from 'lodash'

dotenv.config()

/**
 * NOW works as listing (search for listings)
 *
 *
 *
 */
async function runner() {
  RunManager.killProgramIfMainDataIsNotInitialized(
    'COLLECTION_ADDRESS',
    'POLLING_INTERWALL_IN_MILLS'
  )
  const dataObject = RunManager.getMainDataObject()
  console.log(dataObject.collectionAddress)
  const solanaHub = new SolanaServiceHub('mainnet-beta')
  const con = new Connection(clusterApiUrl('mainnet-beta'))

  Logger.info('Sales Bot', 'Start running...')
  let theMostRecentTransactionSignature = (
    await solanaHub
      .getTransactionService()
      .getTheMostRecentTransactionForAddress(dataObject.collectionAddress)
  ).signature

  Logger.info(
    'Sales Bot',
    'Success to fetch the most recent transaction signature',
    {
      collectionAddress: dataObject.collectionAddress,
      txRecentSignature: theMostRecentTransactionSignature,
    }
  )

  Logger.info(
    'Sales bot',
    'Waiting for the new NFT transactions that goes after recent one'
  )
  while (true) {
    try {
      // Fetch new transactions
      let newTransactions = await solanaHub
        .getTransactionService()
        .getTransactionsGoingAfterTransaction(
          dataObject.collectionAddress,
          theMostRecentTransactionSignature
        )

      // If there are no new transactions. Just retry to fetch new ones after a while
      if (!newTransactions.length) {
        await timer(160)
        continue
      }

      // Collect signatures of new transactions
      let signatures = newTransactions.map(
        (transaction) => transaction.signature
      )
      signatures = _.take(signatures, 99)

      // Initialize the the most recent transaction
      theMostRecentTransactionSignature = signatures[0]

      // Get parsed transactions
      let parsedTransactions = await con.getParsedTransactions(signatures, {
        maxSupportedTransactionVersion: 0,
      })
      // // Logger.info('PARSED TRANSACTIONS COUNT', '', parsedTransactions.length)
      // let parsedTransactionsS = parsedTransactions.filter(
      //   (parsedTransaction) =>
      //     !parsedTransaction?.meta?.postTokenBalances[0]?.mint?.startsWith(
      //       'So111111'
      //     ) &&
      //     parsedTransaction?.meta?.postTokenBalances[0]?.mint?.toString() &&
      //     parsedTransaction?.transaction?.message?.accountKeys?.find((acc) =>
      //       Object.values(dataObject.marketplacesAndPrograms).find(
      //         (marketProgram) => acc.pubkey.toBase58() == marketProgram
      //       )
      //     )
      // )

      //Parse transactions to filter only one that have spl token program (NFT Sale)
      let parssss = parsedTransactions.filter((parsedTransaction) =>
        parsedTransaction?.meta?.innerInstructions?.find(
          (innerInstaction) =>
            !!innerInstaction?.instructions?.find(
              (instruction) =>
                instruction?.parsed?.info?.mint &&
                instruction?.program == 'spl-associated-token-account'
            )
        )
      )

      newTransactions = []
      for (let parsedTransaction of parssss) {
        let isNftSale = await RunManager.isParsedTransactionNFTSale(
          parsedTransaction,
          dataObject,
          solanaHub
        )
        if (isNftSale) {
          newTransactions.push(parsedTransaction)
        }
      }

      if (!newTransactions.length) {
        await timer(160)
        newTransactions = null
        signatures = null
        parsedTransactions = null
        // parsedTransactionsS = null
        parssss = null
        newTransactions = null
        continue
      }

      Logger.info('Sales Bot', 'New transactions found', newTransactions.length)
      for (let index = newTransactions.length - 1; index >= 0; index--) {
        let parsedTransaction = newTransactions[index]
        const NFTData = await Parser.parseParsedTransactionNFTData(
          parsedTransaction,
          dataObject.marketplacesAndPrograms,
          solanaHub
        )
        Logger.info('Sales Bot', 'Found Sold NFT', NFTData)
        Logger.info('Sales Bot', 'Posting to discord')
        await RunManager.postSaleToDiscord(
          dataObject.discordUrl,
          NFTData.item.name,
          NFTData.transaction.price,
          NFTData.transaction.date,
          NFTData.transaction.id,
          NFTData.item.image
        )
        Logger.info('Sales Bot', 'Posted to discord!')
        // await timer(200)
        continue
      }
    } catch (e) {
      throw e
      continue
    }
  }
}
Logger.manage({ level: 'info' })
runner()
