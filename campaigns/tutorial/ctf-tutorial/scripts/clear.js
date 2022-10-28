const { ethers } = require("hardhat");

const BanditAddress = "0xF569Ff850E0918e1DE1073dCe3562A9a43b1B8cd"

const main = async () => {
    const Bandit = await ethers.getContractAt("BanditCamp", BanditAddress);

    await Bandit.clearCamp();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});