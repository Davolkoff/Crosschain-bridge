import { task } from "hardhat/config";
import * as dotenv from "dotenv";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

dotenv.config();

task("redeem", "Mints fungible tokens on your account")
.addParam("from", "Sender of tokens")
.addParam("to", "Recipient of tokens")
.addParam("amount", "Amount of tokens you want to swap")
.addParam("blockchain", "Blockchain-receiver (\"BSC\" or \"ETH\")")
.addParam("nonce", "Nonce of transaction (it shouldn't be the same as last)")
.setAction(async (args, hre) => {

    let sender: SignerWithAddress;
    let app: SignerWithAddress; // backend app's keys
    let bridgeAddress: string;
    let blockchain: boolean;
    
    if (args.blockchain == "ETH"){
        bridgeAddress = process.env.ETH_BRIDGE_ADDRESS as string;
        blockchain = false;
    }
    else {
        bridgeAddress = process.env.BSC_BRIDGE_ADDRESS as string;
        blockchain = true;
    }
    
    const bridge = await hre.ethers.getContractAt("Bridge", bridgeAddress);

    [sender, app] = await hre.ethers.getSigners();

    const msg = await hre.ethers.utils.solidityKeccak256( // "backend" forms message
        ["address", "address", "uint256", "uint256", "bool"], 
        [args.from, args.to, args.amount, args.nonce, blockchain]); 

    let signature = await app.signMessage(await hre.ethers.utils.arrayify(msg)); // "backend" signs message
    let sig = await hre.ethers.utils.splitSignature(signature);

    await bridge.redeem(args.from, args.to, args.amount, args.nonce, sig.v, sig.r, sig.s); // "backend" sends message to blockchain

    console.log("Tokens successfully transferred");
});
