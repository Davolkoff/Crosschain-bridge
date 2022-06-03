# Сrosschain bridge

>This project contains a universal bridge for Binance Smart Chain and Ethereum blockchains and a fungible token that meets the ERC-20 and BEP-20 standards. There are also scripts for deploying tokens and bridges in the Rinkeby and Binance smart chain testnet networks and for connecting tokens to bridges.
-------------------------
# Table of contents
1. <b>Deploying</b>
  + [Deploy ERC20 token](#Deploy-erc20)
  + [Deploy BEP20 token](#Deploy-bep20)
  + [Deploy bridge to Rinkeby](#BR-rinkeby)
  + [Deploy bridge to BSC Testnet](#BR-bsc)
  + [Connect ERC20 to bridge](#Connect-erc)
  + [Connect BEP20 to bridge](#Connect-bep)
2. <b>Swap functions</b>
  + [Swap](#Swap)
  + [Redeem](#Redeem)
3. <b>Other functions</b>
  + [Mint tokens](#Mint)

-------------------------
## 1. Deploying

#### <a name="Deploy-erc20"></a> <b>- Deploy ERC20 token</b> (after executing this command you'll see ERC20 token's address in terminal, address will be added to .env file): 
```shell
npx hardhat run scripts/Tokens/deployERC20.ts --network rinkeby
```

#### <a name="Deploy-bep20"></a> <b>- Deploy BEP20 token</b> (after executing this command you'll see ERC20 token's address in terminal, address will be added to .env file):
```shell
npx hardhat run scripts/Tokens/deployBEP20.ts --network bsctest
```

#### <a name="BR-rinkeby"></a> <b>- Deploy bridge to Rinkeby</b> (after executing this command you'll see bridge's address in terminal, address will be added to .env file): 
```shell
npx hardhat run scripts/Bridges/deployBridgeETH.ts --network rinkeby
```

#### <a name="BR-bsc"></a> <b>- Deploy bridge to BSC Testnet</b> (after executing this command you'll see bridge's address in terminal, address will be added to .env file):
```shell
npx hardhat run scripts/Bridges/deployBridgeBSC.ts --network bsctest
```

#### <a name="Connect-erc"></a> <b>- Connect ERC20 to bridge:</b>
```shell
npx hardhat connect --blockchain ETH --network rinkeby
```

#### <a name="Connect-bep"></a> <b>- Connect BEP20 to bridge:</b>
```shell
npx hardhat connect --blockchain ETH --network bsctest
```

-------------------------

## 2. Swap functions
>In real crosschain bridges, these functions are built into the backend, but here they are implemented as tasks
#### <a name="Swap"></a> <b>- Swap </b>(this function sends your tokens to account on another blockchain. You should accept this transfer by task "redeem"):
```shell
Usage: hardhat [GLOBAL OPTIONS] swap --amount <STRING> --blockchain <STRING> --to <STRING>

OPTIONS:

  --amount      Amount of tokens you want to swap 
  --blockchain  Blockchain-recipient of tokens 
  --to          Recipient of tokens 


Example:

hardhat swap --to 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95 --amount 1000000 --blockchain BSC --network rinkeby
```

#### <a name="Redeem"></a> <b>- Redeem</b> (after executing this command your tokens will be transferred from one blockchain to another):</b>
```shell
Usage: hardhat [GLOBAL OPTIONS] redeem --amount <STRING> --blockchain <STRING> --from <STRING> --nonce <STRING> --to <STRING>

OPTIONS:

  --amount      Amount of tokens you want to swap 
  --blockchain  Blockchain-receiver ("BSC" or "ETH") 
  --from        Sender of tokens 
  --nonce       Nonce of transaction (it should not be the same as last) 
  --to          Recipient of tokens


Example:

hardhat swap --from 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95 --to 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95 --amount 1000000 --blockchain BSC --nonce 0 --network bsctest
```
>This function has so many parameters, since they are needed to sign the transaction. In real cross-chain bridges, all these parameters are entered by the server automatically.
-------------------------

## 3. Other functions

#### <a name="Mint"></a> <b>- Mint</b> (mints tokens to selected account):

```shell
Usage: hardhat [GLOBAL OPTIONS] mint --amount <STRING> --blockchain <STRING> --to <STRING>

OPTIONS:

  --amount      Amount of BEP20 tokens 
  --blockchain  Blockchain-receiver ("BSC" or "ETH") 
  --to          Receiver of tokens 

mint: Mints fungible tokens on selected account


Example:

hardhat mint --to 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95 --amount 10000000000000000 --blockchain BSC --network bsctest

```
