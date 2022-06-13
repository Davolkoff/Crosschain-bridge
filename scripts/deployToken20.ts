import { ethers } from "hardhat";

async function main() {
  const Token20 = await ethers.getContractFactory("Token20");
  const token20 = await Token20.deploy("DVCoin", "DVC", 18);

  await token20.deployed();

  console.log("Token20 address:", token20.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });