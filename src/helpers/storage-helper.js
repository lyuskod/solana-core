import { Keypair } from '@solana/web3.js'
import fs from 'fs'
import { LoggerTool } from '../tools/logger-tool.js'
import { ErrorHelper } from './error-helper.js'
import { binary_to_base58 } from 'base58-js'
import { format } from 'date-fns'

export class StorageHelper {
  #usersStorageFilePath
  #listedNFTsStorageFilePath
  #unlistedNFTsStorageFilePath
  constructor(pathToDir) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      pathToDir,
      'Storage directory path'
    )
    this.#doesDirExists(pathToDir)
    this.#usersStorageFilePath = `${pathToDir}/users-storage.json`
    this.#listedNFTsStorageFilePath = `${pathToDir}/listed-nfts-storage.json`
    this.#unlistedNFTsStorageFilePath = `${pathToDir}/unlisted-nfts-storage.json`
  }

  createUnlistedNFTsStorage() {
    LoggerTool.silly(
      'StorageHelper',
      '[READY] Create unlisted nfts storage file',
      this.#unlistedNFTsStorageFilePath
    )

    LoggerTool.silly(
      'StorageHelper',
      '[READY] Checking if unlisted nfts storage file exists',
      this.#unlistedNFTsStorageFilePath
    )

    const fileExists = this.#doesFileExists(this.#unlistedNFTsStorageFilePath)
    if (!fileExists) {
      LoggerTool.silly(
        'StorageHelper',
        '[READY] Unlisted nfts storage file does not exist. Creating',
        this.#unlistedNFTsStorageFilePath
      )
      fs.writeFileSync(
        this.#unlistedNFTsStorageFilePath,
        JSON.stringify({
          fileCreatedDate: format(Date.now(), 'yyyy-mm-dd hh:mm:ss'),
          fileModifiedDate: format(Date.now(), 'yyyy-mm-dd hh:mm:ss'),
          unlistedNFTs: [],
        })
      )
    }

    LoggerTool.silly(
      'StorageHelper',
      fileExists
        ? '[SUCCESS] Unlisted nfts storage file is already exists. Skipping'
        : '[SUCCESS] Created unlisted nfts storage file',
      this.#unlistedNFTsStorageFilePath
    )
  }

  createListedNFTsStorage() {
    LoggerTool.silly(
      'StorageHelper',
      '[READY] Create listed nfts storage file',
      this.#listedNFTsStorageFilePath
    )

    LoggerTool.silly(
      'StorageHelper',
      '[READY] Checking if listed nfts storage file exists',
      this.#listedNFTsStorageFilePath
    )

    const fileExists = this.#doesFileExists(this.#listedNFTsStorageFilePath)
    if (!fileExists) {
      LoggerTool.silly(
        'StorageHelper',
        '[READY] Listed nfts storage file does not exist. Creating',
        this.#listedNFTsStorageFilePath
      )
      fs.writeFileSync(
        this.#listedNFTsStorageFilePath,
        JSON.stringify({
          fileCreatedDate: format(Date.now(), 'yyyy-mm-dd hh:mm:ss'),
          fileModifiedDate: format(Date.now(), 'yyyy-mm-dd hh:mm:ss'),
          listedNFTs: [],
        })
      )
    }

    LoggerTool.silly(
      'StorageHelper',
      fileExists
        ? '[SUCCESS] Listed nfts storage file is already exists. Skipping'
        : '[SUCCESS] Created listed nfts storage file',
      this.#listedNFTsStorageFilePath
    )
  }

  createUsersStorage() {
    LoggerTool.silly(
      'StorageHelper',
      '[READY] Create users storage file',
      this.#usersStorageFilePath
    )

    LoggerTool.silly(
      'StorageHelper',
      '[READY] Checking if users storage file exists',
      this.#usersStorageFilePath
    )

    const fileExists = this.#doesFileExists(this.#usersStorageFilePath)
    if (!fileExists) {
      LoggerTool.silly(
        'StorageHelper',
        '[READY] Users storage file does not exist. Creating',
        this.#usersStorageFilePath
      )
      fs.writeFileSync(
        this.#usersStorageFilePath,
        JSON.stringify({
          fileCreatedDate: format(Date.now(), 'yyyy-mm-dd hh:mm:ss'),
          fileModifiedDate: format(Date.now(), 'yyyy-mm-dd hh:mm:ss'),
          users: [],
        })
      )
    }

    LoggerTool.silly(
      'StorageHelper',
      fileExists
        ? '[SUCCESS] Users storage file is already exists. Skipping'
        : '[SUCCESS] Created users storage file',
      this.#usersStorageFilePath
    )
  }

  /**
   *
   * @param {Keypair} keypair
   */
  addUnlistedNFTIntoStorage(nftObj) {
    LoggerTool.silly(
      'StorageHelper',
      '[READY] Add unlisted nft into storage',
      this.#unlistedNFTsStorageFilePath
    )
    const unlistedNftsStorage = JSON.parse(
      fs.readFileSync(this.#unlistedNFTsStorageFilePath)
    )
    const date_add = format(Date.now(), 'yyyy-mm-dd hh:mm:ss')

    let index =
      unlistedNftsStorage.unlistedNFTs.length > 0
        ? unlistedNftsStorage.unlistedNFTs.length
        : 0
    unlistedNftsStorage.unlistedNFTs.push({
      id: index,
      mintAddress: nftObj.mintAddress,
      owner: nftObj.owner,
      supply: nftObj.supply,
      collection: nftObj.collection,
      collectionName: nftObj.collectionName,
      name: nftObj.name,
      updateAuthority: nftObj.updateAuthority,
      primarySaleHappened: nftObj.primarySaleHappened,
      sellerFeeBasisPoints: nftObj.sellerFeeBasisPoints,
      image: nftObj.image,
      externalUrl: nftObj.externalUrl,
      listStatus: nftObj.listStatus,
    })
    unlistedNftsStorage.fileModifiedDate = date_add
    fs.writeFileSync(
      this.#unlistedNFTsStorageFilePath,
      JSON.stringify(unlistedNftsStorage)
    )

    LoggerTool.silly(
      'StorageHelper',
      `[SUCCESS] Add unlisted nft with '${index}' ID into storage`,
      this.#unlistedNFTsStorageFilePath
    )
  }

  /**
   *
   * @param {Keypair} keypair
   */
  addUserIntoUsersStorage(
    keypair,
    log_opts = {
      logPublicKey: false,
      logPrivateKey: false,
    }
  ) {
    LoggerTool.silly(
      'StorageHelper',
      '[READY] Add user into users storage',
      this.#usersStorageFilePath
    )
    const publicKey = keypair.publicKey.toBase58()
    const secretKey = binary_to_base58(keypair.secretKey)
    const usersStorage = JSON.parse(fs.readFileSync(this.#usersStorageFilePath))
    const date_add = format(Date.now(), 'yyyy-mm-dd hh:mm:ss')

    let index = usersStorage.users.length > 0 ? usersStorage.users.length : 0
    usersStorage.users.push({
      id: index,
      publicKey: publicKey,
      privateKey: secretKey,
      addedDate: date_add,
    })
    usersStorage.fileModifiedDate = date_add
    fs.writeFileSync(this.#usersStorageFilePath, JSON.stringify(usersStorage))

    LoggerTool.silly(
      'StorageHelper',
      `[SUCCESS] Add user with '${index}' ID into users storage`,
      this.#usersStorageFilePath,
      log_opts.logPublicKey ? publicKey : null,
      log_opts.logPrivateKey ? secretKey : null
    )
  }

  clearUsersStorage() {
    LoggerTool.silly(
      'StorageHelper',
      '[READY] Clear users storage',
      this.#usersStorageFilePath
    )
    const usersStorage = JSON.parse(fs.readFileSync(this.#usersStorageFilePath))
    const usersCount = usersStorage.users.length
    usersStorage.users = []
    fs.writeFileSync(this.#usersStorageFilePath, JSON.stringify(usersStorage))
    LoggerTool.silly(
      'StorageHelper',
      '[SUCCESS] Clear users storage. Removed users count',
      usersCount
    )
  }

  getUsersStorageFile() {
    return JSON.parse(fs.readFileSync(this.#usersStorageFilePath))
  }

  #doesFileExists(path) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(path)
    return fs.existsSync(path)
  }

  #doesDirExists(path) {
    this.#doesFileExists(path)
  }
}
