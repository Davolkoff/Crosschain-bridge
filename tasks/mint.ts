import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("mint", "Mints fungible tokens on selected account")
.addParam("to", "Receiver of tokens")
.addParam("amount", "Amount of BEP20 tokens")
.addParam("blockchain", "Blockchain-receiver (\"BSC\" or \"ETH\")")
.setAction(async (args, hre) => {
    
    let tokenAddress: string;
    if (args.blockchain == "ETH"){
        tokenAddress = process.env.ERC20_ADDRESS as string;
    }
    else {
        tokenAddress = process.env.BEP20_ADDRESS as string;
    }

    const token = await hre.ethers.getContractAt("Token20", tokenAddress);
    await token.mint(args.to, args.amount);
    console.log("Tokens successfully minted");
});