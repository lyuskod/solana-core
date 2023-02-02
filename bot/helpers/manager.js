import { Logger } from '../../src/tools/logger.js'
import { Environment } from '../../src/tools/env.js'
import { SolanaServiceHub } from '../../src/services/solana/hub.js'
import _ from 'lodash'
import { Connection } from '@solana/web3.js/lib/index.cjs.js'

export const timer = (ms) => new Promise((res) => setTimeout(res, ms))
export class RunManager {
  static #currentServiceName = 'Bot Run Manager'
  constructor() {
    if (this instanceof RunManager) {
      const errorMessage = `${RunManager.name} static class cannot be instantiated.`
      Logger.error(RunManager.name, errorMessage)
      throw Error(errorMessage)
    }
  }

  static killProgramIfMainDataIsNotInitialized(...keys) {
    Logger.silly(
      this.#currentServiceName,
      '[READY]: Checking if main config data are in set...',
      keys
    )

    keys.forEach((key) => {
      if (!Environment.envKeyInitialized(key)) {
        const errorMessage = `${key} Environment key is not initialized. Killing the bot...`
        Logger.error(this.#currentServiceName, errorMessage)
        throw new Error(errorMessage)
      }
    })

    Logger.silly(
      this.#currentServiceName,
      '[SUCCESS]: Checking if main config data are in set. Everything is set!',
      keys
    )
  }

  static getMainDataObject() {
    return {
      collectionAddress: Environment.getEnvValueByKey('COLLECTION_ADDRESS'),
      pollingInterval: +Environment.getEnvValueByKey(
        'POLLING_INTERWALL_IN_MILLS'
      ),
      marketplacesAndPrograms: {
        'Magic Eden v1': 'MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8',
        'Magic Eden v2': 'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K',
        'Alpha Art': 'HZaWndaNWHFDd9Dhk5pqUUtsmoBCqzb1MLu3NAh1VX6B',
        Solsea: '617jbWo616ggkDxvW1Le8pV38XLbVSyWY8ae6QUmGBAU',
        Solanart: 'CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz',
        'Digital Eyes': 'A7p8451ktDCHq5yYaHczeLMYsjRsAkzc3hCXcSrwYHU7',
        'Exchange Art': 'AmK5g2XcyptVLCFESBCJqoSfwV3znGoVYQnqEnaAZKWn',
        Elixir: '2qGyiNeWyZxNdkvWHc2jT5qkCnYa1j1gDLSSUmyoWMh8',
        Hadeswap: 'hadeK9DLv9eA7ya5KCTqSvSvRZeJC3JgD5a9Y3CNbvu',
        OpenSea: 'hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk',
      },
    }
  }

  static async isParsedTransactionNFTSale(
    parsedTransaction,
    dataObj,
    solanaServiceInstance
  ) {
    let isNFTSale = false

    let mintAddress = null
    try {
      mintAddress = parsedTransaction?.meta?.postTokenBalances[0]?.mint
      if (mintAddress) {
        const nft = await solanaServiceInstance
          .getNFTService()
          .getNFTDataByMintAddress(mintAddress)
        isNFTSale =
          nft.collection?.address.toBase58() == dataObj.collectionAddress
      }
    } catch (e) {
      console.log(e)
    }

    return isNFTSale
  }
}
