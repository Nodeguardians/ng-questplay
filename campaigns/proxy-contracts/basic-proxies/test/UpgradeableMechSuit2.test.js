const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("UpgradeableMechSuit (Part 2)", function () {
  let upgradeableSuit;
  let mechSuitV1;
  let deployer;

  const STORAGE_SLOT =
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
  const ADMIN_SLOT =
    "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";

  before(async function () {

    deployer = await ethers.getSigner();

    const MechSuitV1 = await ethers.getContractFactory("MechSuitV1");
    mechSuitV1 = await MechSuitV1.deploy();

    const UpgradeableSuit = await ethers.getContractFactory("UpgradeableMechSuit");

    upgradeableSuit = await UpgradeableSuit.deploy(
      mechSuitV1.address
    );

    await upgradeableSuit.deployed();
    await mechSuitV1.deployed();
  });

  it("Should be EIP-1967 compliant", async function () {
    let implSlot = await ethers.provider.getStorageAt(
      upgradeableSuit.address,
      STORAGE_SLOT
    );

    expect("0x" + implSlot.slice(26)).to.be.equals(
      mechSuitV1.address.toLowerCase()
    );

    let adminSlot = await ethers.provider.getStorageAt(
      upgradeableSuit.address,
      ADMIN_SLOT
    );

    expect("0x" + adminSlot.slice(26)).to.be.equals(
      deployer.address.toLowerCase()
    );
  });
});
