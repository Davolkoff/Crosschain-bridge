import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

async function main() {

  const Bridge = await ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy(process.env.OFFCHAIN_PUBLIC_KEY, false, process.env.ERC20_ADDRESS);

  await bridge.deployed();

  console.log("Bridge (ETH) deployed to:", bridge.address);
  fs.appendFileSync('.env', `\nETH_BRIDGE_ADDRESS=${bridge.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
