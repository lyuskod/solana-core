import * as dotenv from 'dotenv'
import { SolanaServiceHub } from '../src/services/solana/hub.js'
import { Logger } from '../src/tools/logger.js'
import { RunManager } from './helpers/manager.js'
import { timer } from '../bot/helpers/manager.js'
import { Parser } from './helpers/parser.js'
import fs from 'fs'
dotenv.config()

async function runner() {
  RunManager.killProgramIfMainDataIsNotInitialized(
    'COLLECTION_ADDRESS',
    'POLLING_INTERWALL_IN_MILLS'
  )
  const dataObject = RunManager.getMainDataObject()
  const solanaHub = new SolanaServiceHub('mainnet-beta')

  Logger.info('Sales Bot', 'Start running...')
  Logger.info('Sales Bot', 'Fetch the most recent transaction')
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
      let newTransactions = await solanaHub
        .getTransactionService()
        .getTransactionsGoingAfterTransaction(
          dataObject.collectionAddress,
          theMostRecentTransactionSignature
        )

      if (!newTransactions.length) {
        Logger.info(
          'Sales Bot',
          'New transactions not found. Retrying fetch....'
        )
        await timer(510)
        continue
      }

      Logger.info('Sales Bot', 'New transactions found', newTransactions.length)
      for (let index = newTransactions.length - 1; index >= 0; index--) {
        let transaction = newTransactions[index]
        theMostRecentTransactionSignature = transaction.signature
        const isNFTSale = await RunManager.checkIfTransactionIsNFTSale(
          transaction,
          solanaHub,
          dataObject
        )
        if (isNFTSale) {
          Logger.info(
            'Sales Bot',
            'Yes, transactions is NFT sale. Parsing NFT data ...',
            transaction.signature
          )
          Logger.info(transaction)
          const NFTData = await Parser.parseTransactionNFTData(
            transaction,
            dataObject.marketplacesAndPrograms,
            solanaHub
          )
          Logger.info('Sales Bot', 'Found Sold NFT', NFTData)
          theMostRecentTransactionSignature = transaction.signature
          await timer(250)
          continue
        } else {
          theMostRecentTransactionSignature = transaction.signature
          await timer(250)
          continue
        }
      }
    } catch (e) {
      Logger.error('Sales Bot', 'An error is thrown', e.message)
      continue
    }
  }
}
Logger.manage({ level: 'info' })
runner()
