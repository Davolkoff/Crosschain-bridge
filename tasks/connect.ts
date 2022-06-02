import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("connect", "Connect fungible token's contract to bridge")
.addParam("blockchain", "Token's blockchain (\"ETH\" or \"BSC\")")
.setAction(async (args, hre) => {
    
    let tokenAddress: string;
    let bridgeAddress: string;

    if (args.blockchain == "ETH"){
        tokenAddress = process.env.ERC20_ADDRESS as string;
        bridgeAddress = process.env.ETH_BRIDGE_ADDRESS as string;
    }
    else {
        tokenAddress = process.env.BEP20_ADDRESS as string;
        bridgeAddress = process.env.BSC_BRIDGE_ADDRESS as string;
    }

    const token = await hre.ethers.getContractAt("Token20", tokenAddress);
    await token.connectBridge(bridgeAddress);

    console.log("Bridge successfully connected");
});
