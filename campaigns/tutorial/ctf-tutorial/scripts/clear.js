const { ethers } = require("hardhat");

const BanditAddress = "0xebde34D161332550cb17b52Bd60ab03F4399C54F"

const main = async () => {
    const Bandit = await ethers.getContractAt("BanditCamp", BanditAddress);

    await Bandit.clearCamp();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});