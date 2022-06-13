import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("connectbr", "Connect fungible token's contract to bridge")
.addParam("braddr", "Bridge address")
.addParam("taddr", "Token address")
.setAction(async (args, hre) => {

    const token = await hre.ethers.getContractAt("Token20", args.taddr);
    await token.connectBridge(args.braddr);

    console.log("Bridge successfully connected");
});