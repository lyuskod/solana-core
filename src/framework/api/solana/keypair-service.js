import { Keypair } from '@solana/web3.js'
import { base58_to_binary, binary_to_base58 } from 'base58-js'

export class KeyPairService {
  /**
   * @description Encodes the private key string into Uint8Array
   * @param {String} privateKeyString - Private key in String
   * @returns
   */
  encodeStrPrivateKey(privateKeyString) {
    return base58_to_binary(privateKeyString)
  }

  /**
   * @description Decodes the private key Uint8Array into String
   * @param {String} privateKeyString - Private key in String
   * @returns
   */
  decodeUint8ArrayPrivateKey(privateKeyUint8Array) {
    return binary_to_base58(privateKeyUint8Array)
  }

  /**
   * @description Creates Keypair solana instance based on private key
   * @param {String} privateKeyString - Private key in String
   * @returns 
   */
  generateKeyPairFromStringPrivateKey(privateKeyString) {
    return Keypair.fromSecretKey(base58_to_binary(privateKeyString))
  }
}
