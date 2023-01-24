import { LoggerTool } from './src/tools/logger-tool.js'
import { SolanaConnectionService } from './src/services/solana/service.js'
import { UsersStorageHelper } from './src/helpers/users-storage-helper.js'
import { MEApiService } from './src/services/magic-eden/service.js'
import { ConfigHelper } from './src/helpers/config-helper.js'
import { ErrorHelper } from './src/helpers/error-helper.js'

async function main() {
  LoggerTool.enable()
  const meApiUrl = 'https://api-mainnet.magiceden.dev/v2'
  const me = new MEApiService(meApiUrl)
  const service = new SolanaConnectionService('mainnet-beta')

  //1. create storage for users
  const usersStorage = new UsersStorageHelper('./tmp')
  usersStorage.createUsersStorage()
  //1.1 create storage for listed & unlisted nft of main account on Magic Eden

  //2. Define main data: keys, expected sales count, nfts type
  const main_publicKey = ConfigHelper.getFeePayerPublicKey()
  const main_privateKey = ConfigHelper.getFeePayerPrivateKey()
  const expectedSalesCount = ConfigHelper.getExpectedSalesCount()
  const expectedNFTsType = ConfigHelper.getExpectedNFTsType()
  const nftsAuthority = ConfigHelper.getAuthority()
  const pricePerSaleInSol = ConfigHelper.getPricePerSaleInSOL()

  //3. Get main user unlisted nfts
  const unlistedNfts = await me
    .getWalletService()
    .getUnlistedNFTs(main_publicKey)
  //3.1. Get main user account SOL balance
  const accountBalance = await service
    .getAccountService()
    .getBalance(main_publicKey)

  //4. Verify account has at least one unlisted NFT
  //4.1 Verify that expected sales count is >= 0
  //4.2 Verify that expected nfts type is valid one
  //4.3 Verify that authority is a valid address
  ErrorHelper.throwErrorIfThereAre0UnlistedNFTs(unlistedNfts.length)
  ErrorHelper.throwErrorIfExpSalesCountIs0(expectedSalesCount)
  ErrorHelper.throwErrorIfInvalidNFTsType(expectedNFTsType)
  ErrorHelper.throwErrorIfInvalidPublicKey(nftsAuthority)
  ErrorHelper.throwErrorIfSolSalePriceIsLessThanBalance(pricePerSaleInSol, accountBalance)

  //5. Fetch the corresponding NFTs list based on expected type
  let nfts = undefined
  switch (expectedNFTsType) {
    case 'listed':
      nfts = await me
        .getWalletService()
        .getListedNFTs(main_publicKey, { limit: expectedSalesCount, offset: 0 })
      break
    case 'unlisted':
      nfts = await me.getWalletService().getUnlistedNFTs(main_publicKey, {
        limit: expectedSalesCount,
        offset: 0,
      })
      break
  }
  //5.1 filter nfts by authority
  let filtered_nfts = nfts.filter(
    (nftObj) => nftObj.updateAuthority === nftsAuthority
  )
  //5.2 verify user has nfts by authority
  ErrorHelper.throwErrorIfUserDoesNotHaveNFTsByProvidedAuthority(
    main_publicKey,
    nftsAuthority,
    filtered_nfts.length,
    expectedNFTsType
  )

  for (let counter = 0; counter < expectedSalesCount; counter++) {
    
  }

  // //Perform operations
  // for (let counter = 0; counter < expectedSalesCount; counter++) {
  //   //5. Create account
  //   const newAccountKP = await service
  //     .getAccountService()
  //     .createRandomAccount(main_privateKey, { logCreatedAccount: true })
  //   //6. Add account into storage
  //   usersStorage.addUserIntoUsersStorage(newAccountKP, {
  //     logPublicKey: true,
  //   })
  //   //
  // }
}
main()
