import { Keypair } from '@solana/web3.js'

export class KeyPairService {
  generate() {
    return Keypair.generate()
  }
}
