const { ethers } = require("hardhat");
const { expect } = require("chai");
const { abi } = require("./testAbi.json");

describe("UpgradeableMechSuit (Part 1)", function () {
  let upgradeableSuit;
  let mechSuitV1;
  let mechSuitV2;

  before(async function () {

    const deployer = await ethers.getSigner();

    const MechSuitV1 = await ethers.getContractFactory("MechSuitV1");
    mechSuitV1 = await MechSuitV1.deploy();
    await mechSuitV1.deployed();

    const MechSuitV2 = await ethers.getContractFactory("MechSuitV2");
    mechSuitV2 = await MechSuitV2.deploy();
    await mechSuitV2.deployed();

    const UpgradeableSuit = await ethers.getContractFactory("UpgradeableMechSuit");
    upgradeableSuit = await UpgradeableSuit.deploy(mechSuitV1.address);
    await upgradeableSuit.deployed();

    upgradeableSuit = new ethers.Contract(
      upgradeableSuit.address,
      abi,
      deployer
    );
    await upgradeableSuit.deployed();
  });

  it("Should forward calls to delegate", async function () {
    await upgradeableSuit.refuel({ value: 1000000000 });

    expect(
      await upgradeableSuit.callStatic.swingHammer()
    ).to.equal(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("HAMMER SMASH!!!"))
    );

    // For real transaction
    await upgradeableSuit.swingHammer();
    expect(await upgradeableSuit.fuel()).to.equal(90);

    await expect(upgradeableSuit.blastCannon()).to.be.reverted;
  });

  it("Should be upgradeable", async function () {
    await upgradeableSuit.upgradeTo(mechSuitV2.address);

    await upgradeableSuit.refuel({ value: 1000000000 });

    expect(
      await upgradeableSuit.callStatic.blastCannon()
    ).to.equal(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BOOM!"))
    );

    // For real transaction
    await upgradeableSuit.blastCannon();
    expect(await upgradeableSuit.ammunition()).to.equal(7);

    await expect(upgradeableSuit.swingHammer()).to.be.reverted;
  });
});
