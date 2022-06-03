import { task } from "hardhat/config";
import * as dotenv from "dotenv";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

dotenv.config();

task("swap", "Sends tokens to the waiting pool")
.addParam("to", "Recipient of tokens")
.addParam("amount", "Amount of tokens you want to swap")
.setAction(async (args, hre) => {

    let bridgeAddress: string;
    
    if (hre.network.name == "rinkeby"){
        bridgeAddress = process.env.ETH_BRIDGE_ADDRESS as string;
    }
    else {
        bridgeAddress = process.env.BSC_BRIDGE_ADDRESS as string;
    }
    
    const bridge = await hre.ethers.getContractAt("Bridge", bridgeAddress);

    await bridge.swap(args.to, args.amount);

    console.log("Tokens have been successfully sent to the waiting pool");
});