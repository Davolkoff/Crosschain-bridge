# Сrosschain bridge

>This project contains a universal bridge for crosschain transfers. There are also scripts for deploying token and bridge in selected blockchain.
-------------------------
# Table of contents
1. <b>Deploying</b>
  + [Deploy standard 20 token](#Deploy-tok20)
  + [Deploy bridge](#Deploy-bridge)
  + [Connect token to bridge](#Connect-ttb)
  + [Adding new token to bridgee](#Token-add)
2. <b>Swap functions</b>
  + [Swap](#Swap)
  + [Redeem](#Redeem)
3. <b>Other functions</b>
  + [Mint tokens](#Mint)

-------------------------
## 1. Deploying

#### <a name="Deploy-tok20"></a> <b>- Deploy standard 20 token</b> (after executing this command you'll see token's address in terminal): 
```shell
npx hardhat run scripts/Tokens/deployERC20.ts --network rinkeby
```

#### <a name="Deploy-bridge"></a> <b>- Deploy bridge</b> (after executing this command you'll see bridge's address in terminal): 
```shell
npx hardhat run scripts/Bridges/deployBridgeETH.ts --network rinkeby
```

#### <a name="Connect-ttb"></a> <b>- Connect token to bridge:</b>
>You should use this command to check bridge's signature inside your token
```shell
Usage: hardhat [GLOBAL OPTIONS] connectbr --braddr <STRING> --taddr <STRING>

OPTIONS:

  --braddr      Bridge address 
  --taddr       Token address


Example:
npx hardhat connectbr --braddr 0xEeB33C0aDc9f4d0625f60a342cc87f5882840A74 --taddr 0x21befd2aB06fC62817e93cf13CB0685Ef0a33ae2  --network rinkeby
```

#### <a name="Token-add"></a> <b>- Adding new token to bridge:</b>
>You should use this command to add token to bridge's database (can be used only by owner)
```shell
Usage: hardhat [GLOBAL OPTIONS] connecttok --braddr <STRING> --taddr <STRING>

OPTIONS:

  --braddr      Bridge address 
  --taddr       Token address 


Example:
npx hardhat connecttok --braddr 0xEeB33C0aDc9f4d0625f60a342cc87f5882840A74 --taddr 0x21befd2aB06fC62817e93cf13CB0685Ef0a33ae2  --network rinkeby
```
-------------------------

## 2. Swap functions
>In real crosschain bridges, these functions are built into the backend, but here they are implemented as tasks
#### <a name="Swap"></a> <b>- Swap </b>(this function sends your tokens to account on another blockchain. You should accept this transfer by task "redeem"):
```shell
Usage: hardhat [GLOBAL OPTIONS] swap --amount <STRING> --bchain <STRING> --braddr <STRING> --taddr <STRING> --to <STRING>

OPTIONS:

  --amount      Amount of tokens you want to swap 
  --bchain      Blockchain recipient 
  --braddr      Bridge address 
  --taddr       Token address 
  --to          Recipient of tokens 


Example:

npx hardhat swap --to 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95 --amount 1000000 --bchain 97 --braddr 0xEeB33C0aDc9f4d0625f60a342cc87f5882840A74 --taddr 0x21befd2aB06fC62817e93cf13CB0685Ef0a33ae2  --network rinkeby
```

#### <a name="Redeem"></a> <b>- Redeem</b> (after executing this command your tokens will be transferred from one blockchain to another):</b>
```shell
Usage: hardhat [GLOBAL OPTIONS] redeem --amount <STRING> --bchain <STRING> --braddr <STRING> --nonce <STRING> --taddr <STRING> --to <STRING>

OPTIONS:

  --amount      Amount of tokens you want to swap 
  --bchain      Blockchain sender 
  --braddr      Bridge address 
  --nonce       Nonce of transaction (it should not be the same as last) 
  --taddr       Token address 
  --to          Recipient of tokens 


Example:

npx hardhat swap --to 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95 --amount 1000000 --bchain 4 --braddr 0xEeB33C0aDc9f4d0625f60a342cc87f5882840A74 --taddr 0x21befd2aB06fC62817e93cf13CB0685Ef0a33ae2 --nonce 43  --network bsctest
```
>This functions has so many parameters, since they are needed to sign the transaction. In real cross-chain bridges, all these parameters are entered by the server automatically.
-------------------------

## 3. Other functions

#### <a name="Mint"></a> <b>- Mint</b> (mints tokens to selected account):

```shell
Usage: hardhat [GLOBAL OPTIONS] mint --amount <STRING> --to <STRING>

OPTIONS:

  --amount      Amount of tokens 
  --to          Receiver of tokens 


Example:

npx hardhat mint --to 0x5A31ABa56b11cc0Feae06C7f907bED9Dc1C02f95 --amount 10000000000000000 --network bsctest

```
