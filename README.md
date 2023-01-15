# DUC
Welcome to the DUC repository!
This project is created to simulate the NFT Sales.

# Tooling Created
1. Magic Eden API framework based on [Magic Eden API Docs](https://api.magiceden.dev/) to interact with marketplace via API
2. Axios API framework based on [Axios API Docs](https://axios-http.com/docs/intro) to send the API requests through
3. Solana API framework based on [Solana Web3 SDK](https://docs.solana.com/developing/clients/javascript-api) to interact with Solana blockchain
4. [DTOContract.class] is used to cast raw obj into class models (DTO)
5. [EnvironmentHelper.class] is used to simply fetch an environment variables from [.env] file
6. [ErrorHelper.class] is used to handle errors while execution

# Requirements
- node v18.12.1
- Docker 20.10.21

# How it works
1. Docker-compose ups 2 services:
- app
- mysql
2. App starts performing sales on MagicEden

## Docker workflow
This repo stores 2 docker files:
- `Dockerfile` (for application)
- `docker-compose.yaml` (to build 2 services: app & mysql)

:warning: Before build, please see the `docker-compose.yaml` file to have a clear visibility of what exactly happens

Flow:
1. Build docker via docker-compose:
```
docker-compose up .
```

2. Connect to container via following command:
```
docker exec -it <container-name> mysql -uroot -p
```
_Container names are constants and can be found inside `docker-compose.yaml`_


## Magic-Eden service
`services`:
- `service.js` Entrypoint 
- `nft-service.js` Service for working with NFT on Magic Eden 
- `wallet-service.js` Service for working with Wallet on Magic Eden
- `collection-service.js` Service for working with NFT Collections on Magic Eden 

Examples:

Wallet:
```
await new MEApiService(apiUrl)
    .getWalletService()
    .getBalance(accountPublicKey)
```

NFT:
```
await new MEApiService(apiUrl)
    .getNFTService()
    .getNFTInfo(nftAddress)
```

Collections:
```
await new MEApiService(apiUrl)
    .getCollectionService()
    .getInfoByCollectionSymbol('duc')
```


## Solana service
`services`:
- `service.js` Entrypoint 
- `account-service.js` Service for working with Account on Solana Blockchain 
- `transaction-service.js` Service for working with transactions on Solana Blockchain
- `keypair-service.js` Service for working with base58 PrivateKeys, PublicKeys, decode/encode and etc.

Examples:

Account:
```
await new SolanaConnectionService('mainnet')
    .getAccountService()
    .getBalance(accountPublicKey)
```
:warning: Possible networks are `mainnet`, `devnet`, `testnet`. Make sure youre are not in `mainnet` when testing

Keypair:
```
await new SolanaConnectionService('mainnet')
    .getKeyPairService()
    .encodeStrPrivateKey(privateKey)
```

Keypair:
```
await new SolanaConnectionService('mainnet')
    .getKeyPairService()
    .encodeStrPrivateKey(privateKey)
```

Transaction (Sending `0.015 SOL`):
```
await new SolanaConnectionService('mainnet')
    .getTransactionService()
    .transferSol(senderPublicKey, receiverPublicKey, {
      secretKeyByteArray,
      solAmount: 0.015
    })
```

TBC
