import { Logger } from '../../tools/logger.js'

export class SolanaValidatorService {
  static #testNetworks = ['devnet', 'testnet']
  static #prodNetworks = ['mainnet-beta']
  static #validNetworks = ['devnet', 'testnet', 'mainnet-beta']
  static #currentServiceName = 'Validator'
  constructor() {
    if (this instanceof SolanaValidatorService) {
      const errorMessage = `${SolanaValidatorService.name} static class cannot be instantiated.`
      Logger.error(SolanaValidatorService.name, errorMessage)
      throw Error(errorMessage)
    }
  }

  static validateTestNetwork(network) {
    const errorMessage = `'${network}' is not a test network. Available test networks are: [${
      SolanaValidatorService.#testNetworks
    }]`
    if (!SolanaValidatorService.#testNetworks.includes(network)) {
      Logger.error(this.#currentServiceName, errorMessage)
      throw new Error(errorMessage)
    }
  }

  static validateMainNetwork(network) {
    const errorMessage = `'${network}' is not a production network. Available production networks are: [${
      SolanaValidatorService.#prodNetworks
    }]`
    if (!SolanaValidatorService.#prodNetworks.includes(network)) {
      Logger.error(this.#currentServiceName, errorMessage)
      throw new Error(errorMessage)
    }
  }

  static validateNetwork(network) {
    const errorMessage = `'${network}' is not a valid network. Available networks are: [${
      SolanaValidatorService.#validNetworks
    }]`
    if (!SolanaValidatorService.#validNetworks.includes(network)) {
      Logger.error(this.#currentServiceName, errorMessage)
      throw new Error(errorMessage)
    }
  }
}
