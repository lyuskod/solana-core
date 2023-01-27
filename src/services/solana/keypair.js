import { Keypair } from '@solana/web3.js'
import { base58_to_binary, binary_to_base58 } from 'base58-js'
import { ErrorHelper } from '../../helpers/error.js'
import { Logger } from '../../tools/logger.js'
import { SolanaValidatorService } from './validator.js'

export class SolanaKeyPairService {
  #network
  #currentServiceName = 'Keypair'
  constructor(network) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      network,
      'Solana network for keypair service'
    )
    SolanaValidatorService.validateNetwork(network)
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
    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[READY] Generate random keypair`
    )

    let kp = Keypair.generate()

    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[SUCCESS] Generate random keypair`,
      log_opts.logKeyPair ? kp : null
    )
    return kp
  }

  /**
   * @description Encodes the private/public key string into Uint8Array
   * @param {String} privateKeyString - Private/Public key in String
   * @returns {Uint8Array}
   */
  encodeStrPKey(
    privateKeyString,
    opts = { logPrivateKey: false, logEncodedUInt8Array: false }
  ) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      privateKeyString,
      'Private key'
    )
    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[READY] Encode string private key into Uint8Array`,
      opts.logPrivateKey ? privateKeyString : null
    )
    let array = base58_to_binary(privateKeyString)

    Logger.silly(
      this.#currentServiceName,
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
    ErrorHelper.throwErrorIfArrayIsEmptyOrNullOrUndefined(
      privateKeyUint8Array,
      'Private key UInt8Array'
    )
    Logger.silly(
      this.#currentServiceName,
      `(${this.#network})[READY] Decode Uint8Array private key into String`,
      opts.logPrivateKeyUint8Array ? privateKeyUint8Array : null
    )

    let strPrivateKey = binary_to_base58(privateKeyUint8Array)

    Logger.silly(
      this.#currentServiceName,
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
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      privateKeyString,
      'Private key'
    )
    Logger.silly(
      SolanaKeyPairService.name,
      `(${this.#network})[READY] Create Keypair instance based on private key`,
      opts.logPrivateKey ? privateKeyString : null
    )
    let keyPair = Keypair.fromSecretKey(base58_to_binary(privateKeyString))

    Logger.silly(
      SolanaKeyPairService.name,
      `(${
        this.#network
      })[SUCCESS] Create Keypair instance based on private key`,
      opts.logCreatedKeyPair ? keyPair : null
    )

    return keyPair
  }
}
