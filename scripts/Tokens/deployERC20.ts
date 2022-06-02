import { ethers } from "hardhat";
import * as fs from 'fs'

async function main() {
  const Token20 = await ethers.getContractFactory("Token20");
  const token20 = await Token20.deploy("DVCoin", "DVC", 18);

  await token20.deployed();

  console.log("ERC20 contract address:", token20.address);

  fs.appendFileSync('.env', `\nERC20_ADDRESS=${token20.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });