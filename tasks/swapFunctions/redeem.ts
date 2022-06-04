import { task } from "hardhat/config";
import * as dotenv from "dotenv";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

dotenv.config();

task("redeem", "Сompletes the transaction")
.addParam("to", "Recipient of tokens")
.addParam("amount", "Amount of tokens you want to swap")
.addParam("nonce", "Nonce of transaction (it shouldn't be the same as last)")
.setAction(async (args, hre) => {

    let sender: SignerWithAddress;
    let app: SignerWithAddress; // backend app's keys
    let bridgeAddress: string;
    let blockchain: boolean;
    
    if (hre.network.name == "rinkeby"){
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
        [sender.address, args.to, args.amount, args.nonce, blockchain]); 

    let signature = await app.signMessage(await hre.ethers.utils.arrayify(msg)); // "backend" signs message
    let sig = await hre.ethers.utils.splitSignature(signature);

    await bridge.redeem(sender.address, args.to, args.amount, args.nonce, sig.v, sig.r, sig.s); // "backend" sends message to blockchain

    console.log("Tokens successfully transferred");
});
