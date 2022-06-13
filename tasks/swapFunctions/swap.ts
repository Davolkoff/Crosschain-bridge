import { task } from "hardhat/config";
import * as dotenv from "dotenv";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

dotenv.config();

task("swap", "Sends tokens to the waiting pool")
.addParam("to", "Recipient of tokens")
.addParam("amount", "Amount of tokens you want to swap")
.addParam("braddr", "Bridge address")
.addParam("taddr", "Token address")
.addParam("bchain", "Blockchain recipient")
.setAction(async (args, hre) => {
    
    const bridge = await hre.ethers.getContractAt("Bridge", args.braddr);

    await bridge.swap(args.taddr, args.to, args.amount, args.bchain);

    console.log("Tokens have been successfully sent to the waiting pool");
});