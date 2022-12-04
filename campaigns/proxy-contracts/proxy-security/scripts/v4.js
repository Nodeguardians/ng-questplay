const { ethers } = require("hardhat");

const PROXY_ADDR = "0x799b3798E66ba7bfa8aA07a0F1612bC72b1e5159"

async function main() {
  const camp = await ethers.getContractAt(
    "BadMechSuit4", PROXY_ADDR);

  await camp.upgradeTo(3)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});