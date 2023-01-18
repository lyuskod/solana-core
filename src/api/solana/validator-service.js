export class SolanaValidatorService {
  static #testNetworks = ['devnet', 'testnet']
  static #prodNetworks = ['mainnet-beta']
  constructor() {
    if (this instanceof SolanaValidatorService) {
      throw Error('A static class cannot be instantiated.')
    }
  }

  static validateTestNetwork(network) {
    if (!SolanaValidatorService.#testNetworks.includes(network)) {
      throw new Error(
        `'${network}' is not a test network. Available test networks are: [${
          SolanaValidatorService.#testNetworks
        }]`
      )
    }
  }

  static validateMainNetwork(network) {
    if (!SolanaValidatorService.#prodNetworks.includes(network)) {
      throw new Error(
        `'${network}' is not a production network. Available production networks are: [${
          SolanaValidatorService.#prodNetworks
        }]`
      )
    }
  }

  static validateNetwork(network) {
    const networks = ['mainnet', 'devnet', 'testnet']
    if (!networks.includes(network)) {
      throw new Error(
        `'${network}' is not a valid network. Available production networks are: [${networks}]`
      )
    }
  }
}
