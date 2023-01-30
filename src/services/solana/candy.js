import { PublicKey } from '@solana/web3.js'
import { SolanaValidatorService } from './validator.js'
import { ErrorHelper } from '../../helpers/error.js'

export class SolanaCandyMachineService {
  #connection
  #network
  #currentServiceName = 'Solana CandyMachine Service'
  #candyMachinePrograms
  constructor(connection, network) {
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      connection,
      'Solana connection for candy machine service'
    )
    ErrorHelper.throwErrorIfUndefinedNullOrEmpty(
      network,
      'Solana network for candy machine service'
    )
    SolanaValidatorService.validateNetwork(network)
    this.#network = network
    this.#connection = connection
    this.#candyMachinePrograms = {
      v2: 'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ',
    }
  }

  /**
   *
   * @param {String} candyMachineId
   * @returns {String}
   */
  getCandyMachineCreatorAddressByCandyMachineId(candyMachineId) {
    const candyMachineCreator = PublicKey.findProgramAddressSync(
      [Buffer.from('candi_machine'), new PublicKey(candyMachineId).toBuffer()],
      new PublicKey(this.#candyMachinePrograms.v2)
    )
    return candyMachineCreator[0].toBase58()
  }
}
