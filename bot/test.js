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

async function runner() {
  RunManager.killProgramIfMainDataIsNotInitialized(
    'COLLECTION_ADDRESS',
    'POLLING_INTERWALL_IN_MILLS'
  )
  const dataObject = RunManager.getMainDataObject()
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
      let newTransactions = await solanaHub
        .getTransactionService()
        .getTransactionsGoingAfterTransaction(
          dataObject.collectionAddress,
          theMostRecentTransactionSignature
        )

      //1. Collect signatures
      let signatures = newTransactions.map(
        (transaction) => transaction.signature
      )
      signatures = _.take(signatures, 99)
      Logger.info('SIGNATURES COUNT', '', signatures.length)

      //2. Get parsed transactions
      let parsedTransactions = await con.getParsedTransactions(signatures, {
        maxSupportedTransactionVersion: 0,
      })
      Logger.info('PARSED TRANSACTIONS COUNT', '', parsedTransactions.length)
      let parsedTransactionsS = parsedTransactions.filter(
        (parsedTransaction) =>
          !parsedTransaction?.meta?.postTokenBalances[0]?.mint?.startsWith(
            'So111111'
          ) && parsedTransaction?.meta?.postTokenBalances[0]?.mint?.toString()
      )

      //3. Filter only new transactions
      theMostRecentTransactionSignature = signatures[0]
      newTransactions = []
      for (let parsedTransaction of parsedTransactionsS) {
        let isNftSale = await RunManager.isParsedTransactionNFTSale(
          parsedTransaction,
          dataObject,
          solanaHub
        )
        if (isNftSale) {
          newTransactions.push(parsedTransaction)
        }
        await timer(200)
      }

      Logger.info('NEW TRANSACTIONS COUNT', '', newTransactions.length)

      if (!newTransactions.length) {
        Logger.info(
          'Sales Bot',
          'New transactions not found. Retrying fetch....'
        )
        await timer(160)
        continue
      }

      Logger.info('Sales Bot', 'New transactions found', newTransactions.length)
      for (let index = newTransactions.length - 1; index >= 0; index--) {
        let parsedTransaction = newTransactions[index]
        Logger.info(
          'Sales Bot',
          'Yes, transactions is NFT sale. Parsing NFT data ...',
          parsedTransaction
        )
        const NFTData = await Parser.parseParsedTransactionNFTData(
          parsedTransaction,
          dataObject.marketplacesAndPrograms,
          solanaHub
        )
        Logger.info('Sales Bot', 'Found Sold NFT', NFTData)
        // await timer(200)
        continue
      }
    } catch (e) {
      Logger.error('Sales Bot', 'An error is thrown', e.message)
      throw e
      continue
    }
  }
}
Logger.manage({ level: 'info' })
runner()
