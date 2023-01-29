import { Logger } from '../../tools/logger.js'

export class SolanaValidatorService {
  static #testNetworks = ['devnet', 'testnet']
  static #prodNetworks = ['mainnet-beta']
  static #validNetworks = ['devnet', 'testnet', 'mainnet-beta']
  static #currentServiceName = 'Solana Validator Service'
  constructor() {
    if (this instanceof SolanaValidatorService) {
      const errorMessage = `${SolanaValidatorService.name} static class cannot be instantiated.`
      Logger.error(SolanaValidatorService.name, errorMessage)
      throw Error(errorMessage)
    }
  }

  /**
   * @description - Validate test network value is correct
   * @param {String} network - Test network alias
   * @throws {Error}
   */
  static validateTestNetwork(network) {
    Logger.ready(
      this.#currentServiceName,
      'Ready to validate test network value',
      network
    )

    const errorMessage = `'${network}' is not a test network. Available test networks are: [${
      SolanaValidatorService.#testNetworks
    }]`
    if (!SolanaValidatorService.#testNetworks.includes(network)) {
      Logger.error(this.#currentServiceName, errorMessage)
      throw new Error(errorMessage)
    }

    Logger.success(
      this.#currentServiceName,
      'Success to validate test network value',
      network
    )
  }

  static validateMainNetwork(network) {
    Logger.ready(
      this.#currentServiceName,
      'Ready to validate main network value',
      network
    )

    const errorMessage = `'${network}' is not a production network. Available production networks are: [${
      SolanaValidatorService.#prodNetworks
    }]`
    if (!SolanaValidatorService.#prodNetworks.includes(network)) {
      Logger.error(this.#currentServiceName, errorMessage)
      throw new Error(errorMessage)
    }
    Logger.success(
      this.#currentServiceName,
      'Success to validate main network value',
      network
    )
  }

  static validateNetwork(network) {
    Logger.ready(
      this.#currentServiceName,
      'Ready to validate network value',
      network
    )

    const errorMessage = `'${network}' is not a valid network. Available networks are: [${
      SolanaValidatorService.#validNetworks
    }]`
    if (!SolanaValidatorService.#validNetworks.includes(network)) {
      Logger.error(this.#currentServiceName, errorMessage)
      throw new Error(errorMessage)
    }

    Logger.success(
      this.#currentServiceName,
      'Success to validate network value',
      network
    )
  }
}
