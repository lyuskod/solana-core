import { ErrorHelper } from '../../src/helpers/error.js'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import _ from 'lodash'

export class Parser {
  static #currentServiceName = 'Parser'
  constructor() {
    if (this instanceof Parser) {
      const errorMessage = `${Parser.name} static class cannot be instantiated.`
      Logger.error(Parser.name, errorMessage)
      throw Error(errorMessage)
    }
  }

  static async parseParsedTransactionNFTData(
    parsedTransaction,
    marketplaces,
    solanaHub
  ) {
    ErrorHelper.throwErrorIfArrayIsEmptyOrNullOrUndefined(
      parsedTransaction,
      'Transaction to parse NFT data from'
    )

    let accounts = parsedTransaction.transaction.message.accountKeys
    let marketplaceAccount = accounts[accounts.length - 1].pubkey.toString()
    marketplaceAccount = (
      await solanaHub.getWalletService().getWalletInfo(marketplaceAccount)
    ).owner.toBase58()
    let marketplaceName = null
    for (const [name, address] of Object.entries(marketplaces)) {
      if (address == marketplaceAccount) {
        marketplaceName = name
        break
      }
    }
    const nftAddress = parsedTransaction.meta.postTokenBalances[0].mint
    const metadata = await solanaHub
      .getNFTService()
      .getNFTDataByMintAddress(nftAddress)
    return {
      links: {
        solanaFM: `https://solana.fm/tx/${parsedTransaction.signatures[0]}`,
        solscan: `https://solscan.io/tx/${parsedTransaction.signatures[0]}`,
      },
      transaction: {
        id: parsedTransaction.signatures[0],
        date: new Date(transaction.blockTime * 1000).toLocaleString(),
        price:
          Math.abs(
            parsedTransaction.meta.preBalances[0] -
              parsedTransaction.meta.postBalances[0]
          ) / LAMPORTS_PER_SOL,
        buyer: accounts[0].pubkey.toString(),
        seller: accounts[5].pubkey.toString(),
        marketplace: marketplaceName,
        marketplaceAcc: marketplaceAccount,
      },
      item: {
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        image: metadata.image,
        website: metadata.external_url,
        attributes: _.cloneDeep(metadata.attributes),
        properties: _.cloneDeep(metadata.properties),
      },
    }
  }
}
