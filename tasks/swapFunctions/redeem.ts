import { task } from "hardhat/config";
import * as dotenv from "dotenv";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

dotenv.config();

task("redeem", "Completes the transaction")
.addParam("to", "Recipient of tokens")
.addParam("amount", "Amount of tokens you want to swap")
.addParam("nonce", "Nonce of transaction (it shouldn't be the same as last)")
.addParam("taddr", "Token address")
.addParam("braddr", "Bridge address")
.addParam("bchain", "Blockchain sender")
.setAction(async (args, hre) => {

    let sender: SignerWithAddress;
    let app: SignerWithAddress; // backend app's keys
    
    const bridge = await hre.ethers.getContractAt("Bridge", args.braddr);

    [sender, app] = await hre.ethers.getSigners();

    const msg = await hre.ethers.utils.solidityKeccak256( // "backend" forms message
        ["address", "address", "uint256", "uint256", "uint256", "uint256"], 
        [sender.address, args.to, args.amount, args.nonce, args.bchain, hre.network.config.chainId]); 

    let signature = await app.signMessage(await hre.ethers.utils.arrayify(msg)); // "backend" signs message
    let sig = await hre.ethers.utils.splitSignature(signature);

    await bridge.redeem(args.taddr, sender.address, args.to, args.amount, args.nonce, args.bchain, sig.v, sig.r, sig.s); // "backend" sends message to blockchain

    console.log("Tokens successfully transferred");
});