import { Keypair } from '@solana/web3.js'
import { base58_to_binary, binary_to_base58 } from 'base58-js'
import { LoggerTool } from '../../tools/logger-tool.js'

export class KeyPairService {
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
      KeyPairService.name,
      'Encode string private key into Uint8Array',
      opts.logPrivateKey ? privateKeyString : null
    )
    let array = base58_to_binary(privateKeyString)

    if (opts.logEncodedUInt8Array) {
      LoggerTool.silly(KeyPairService.name, 'Encoded Uint8Array', array)
    }
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
      KeyPairService.name,
      'Decode Uint8Array private key into String',
      opts.logPrivateKeyUint8Array ? privateKeyUint8Array : null
    )

    let strPrivateKey = binary_to_base58(privateKeyUint8Array)
    if (opts.logDecodedStringPrivateKey) {
      LoggerTool.silly(
        KeyPairService.name,
        'Decoded Uint8Array private key (String)',
        strPrivateKey
      )
    }

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
      KeyPairService.name,
      'Create Keypair instance based on private key',
      opts.logPrivateKey ? privateKeyString : null
    )
    let keyPair = Keypair.fromSecretKey(base58_to_binary(privateKeyString))

    if (opts.logCreatedKeyPair) {
      LoggerTool.silly(
        KeyPairService.name,
        'Created Keypair instance based on private key',
        keyPair
      )
    }

    return keyPair
  }
}