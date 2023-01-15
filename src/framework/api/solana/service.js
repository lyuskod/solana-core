import { KeyPairService } from './keypair-service.js'

export class SolanaService {
  #keyPairService
  constructor() {
    this.#keyPairService = new KeyPairService()
  }

  getKeyPairService() {
    return this.#keyPairService
  }
}
