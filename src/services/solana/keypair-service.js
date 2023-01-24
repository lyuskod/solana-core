import { Keypair } from '@solana/web3.js'
import { base58_to_binary, binary_to_base58 } from 'base58-js'
import { LoggerTool } from '../../tools/logger-tool.js'

export class SolanaKeyPairService {
  #serviceName = 'Keypair'
  #network
  constructor(network) {
    this.#network = network
  }

  /**
   * @description Generates random keypair
   * @returns
   */
  generateRandomKeypair(
    log_opts = {
      logKeyPair: false,
    }
  ) {
    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[READY] Generate random keypair`
    )

    let kp = Keypair.generate()

    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[SUCCESS] Generate random keypair`,
      log_opts.logKeyPair ? kp : null
    )
    return kp
  }

  /**
   * @description Encodes the private/public key string into Uint8Array
   * @param {String} privateKeyString - Private/Public key in String
   * @returns
   */
  encodeStrPKey(
    privateKeyString,
    opts = { logPrivateKey: false, logEncodedUInt8Array: false }
  ) {
    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[READY] Encode string private key into Uint8Array`,
      opts.logPrivateKey ? privateKeyString : null
    )
    let array = base58_to_binary(privateKeyString)

    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[SUCCESS] Encode string private key into Uint8Array`,
      opts.logEncodedUInt8Array ? array : null
    )
    return array
  }

  /**
   * @description Decodes the private/public key Uint8Array into String
   * @param {String} privateKeyUint8Array - Private/Public key in Uint8Array
   * @returns
   */
  decodeUint8ArrayPKey(
    privateKeyUint8Array,
    opts = { logPrivateKeyUint8Array: false, logDecodedStringPrivateKey: false }
  ) {
    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[READY] Decode Uint8Array private key into String`,
      opts.logPrivateKeyUint8Array ? privateKeyUint8Array : null
    )

    let strPrivateKey = binary_to_base58(privateKeyUint8Array)

    LoggerTool.silly(
      this.#serviceName,
      `(${this.#network})[SUCCESS] Decode Uint8Array private key into String`,
      opts.logPrivateKeyUint8Array ? privateKeyUint8Array : null,
      opts.logDecodedStringPrivateKey ? strPrivateKey : null
    )

    return strPrivateKey
  }

  /**
   * @description Creates Keypair solana instance based on private key
   * @param {String} privateKeyString - Private key in String
   * @returns
   */
  generateKeyPairFromStringPrivateKey(
    privateKeyString,
    opts = {
      logPrivateKey: false,
      logCreatedKeyPair: false,
    }
  ) {
    LoggerTool.silly(
      SolanaKeyPairService.name,
      `(${this.#network})[READY] Create Keypair instance based on private key`,
      opts.logPrivateKey ? privateKeyString : null
    )
    let keyPair = Keypair.fromSecretKey(base58_to_binary(privateKeyString))

    LoggerTool.silly(
      SolanaKeyPairService.name,
      `(${
        this.#network
      })[SUCCESS] Create Keypair instance based on private key`,
      opts.logCreatedKeyPair ? keyPair : null
    )

    return keyPair
  }
}
