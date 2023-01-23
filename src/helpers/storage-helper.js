import { Keypair } from '@solana/web3.js'
import fs from 'fs'
import { LoggerTool } from '../tools/logger-tool.js'
import { ErrorHelper } from './error-helper.js'
import { binary_to_base58 } from 'base58-js'
import { format } from 'date-fns'

export class StorageHelper {
  #usersStorageFilePath
  constructor(pathToDir) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      pathToDir,
      'Storage directory path'
    )
    this.#doesDirExists(pathToDir)
    this.#usersStorageFilePath = `${pathToDir}/users-storage.json`
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
