import { task } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

task("connecttok", "Adds now token to bridge's database")
.addParam("braddr", "Bridge address")
.addParam("taddr", "Token address")
.setAction(async (args, hre) => {

    const bridge = await hre.ethers.getContractAt("Bridge", args.braddr);
    await bridge.connectToken(args.taddr);

    console.log("Token successfully added");
});