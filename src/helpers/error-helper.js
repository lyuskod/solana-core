import { PublicKey } from '@solana/web3.js'

export class ErrorHelper {
  constructor() {
    if (this instanceof ErrorHelper) {
      throw Error('A static class cannot be instantiated.')
    }
  }

  static throwErrorIfUndefinedNullOrEmpty(value, valueName = '') {
    if (!value) {
      throw new Error(
        `${valueName ? valueName : ''}Value cannot be null/undefined/empty`
      )
    }
  }

  static throwErrorIfArrayIsEmptyOrNull(array, arrayName = '') {
    if (array == null || array.length == 0) {
      throw new Error(
        `${arrayName ? arrayName : ''} array cannot be null or empty`
      )
    }
  }

  static throwErrorIfThereAre0UnlistedNFTs(publicKey, unlistedNFTsCount) {
    if (unlistedNFTsCount == 0) {
      throw new Error(
        `Your Magic Eden account has no unlisted NFTs. Unlist at least one and try again. Account: ${publicKey}`
      )
    }
  }

  static throwErrorIfExpSalesCountIs0(publicKey, expectedSalesCount) {
    if (expectedSalesCount <= 0) {
      throw new Error(
        `Expected sales count cannot negative or 0. You provided: ${expectedSalesCount}`
      )
    }
  }

  static throwErrorIfInvalidNFTsType(nftsType) {
    const validTypes = ['listed', 'unlisted']
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(nftsType, 'NFT type')
    if (!validTypes.includes(nftsType)) {
      throw new Error(
        `Invalid value for useNFTsThatAre. Available types are: 'listed' or 'unlisted'`
      )
    }
  }

  static throwErrorIfInvalidPublicKey(publicKey) {
    new PublicKey(publicKey)
  }

  static throwErrorIfSolSalePriceIsLessThanBalance(
    solPerPrice,
    accountBalance
  ) {
    if (solPerPrice >= accountBalance) {
      throw new Error(
        `Insufficent SOL balance. You cannot perform transaction (sale + fee). Sol balance: ${accountBalance}. NFT sale price: ${solPerPrice}`
      )
    }
  }

  static throwErrorIfUserDoesNotHaveNFTsByProvidedAuthority(
    publicKey,
    authorityPublicKey,
    nftsCount,
    nftType
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(publicKey, 'Public key')
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      authorityPublicKey,
      'Authority Public key'
    )
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(nftType, 'nft type')
    if (nftsCount == 0) {
      throw new Error(
        `Account does not have any ${nftType} NFTs with ${authorityPublicKey} authority. Account: ${publicKey}`
      )
    }
  }
}
