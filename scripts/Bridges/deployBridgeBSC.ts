import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

async function main() {

  const Bridge = await ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy(process.env.OFFCHAIN_PUBLIC_KEY, true, process.env.BEP20_ADDRESS);

  await bridge.deployed();

  console.log("Bridge (BSC) deployed to:", bridge.address);
  fs.appendFileSync('.env', `\nBSC_BRIDGE_ADDRESS=${bridge.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
