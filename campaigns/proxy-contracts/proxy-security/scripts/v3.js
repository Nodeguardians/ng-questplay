const { ethers } = require("hardhat");

const PROXY_ADDR = "0x6fa9af7632b454c1ea4839726afccb13ddd145ef"

async function main() {
  const camp = await ethers.getContractAt(
    "SuitLogic", PROXY_ADDR);

  await camp.explode({value: 1});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});