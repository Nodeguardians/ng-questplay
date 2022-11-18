const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Contract (Part 2)", function () {
  let contract;

  before(async function () {
    const Contract = await ethers.getContractFactory("Contract");
    contract = await Contract.deploy();

    await contract.deployed();
  });

  it("bar() should work", async function () {
    expect(contract.bar()).to.not.be.reverted;
  });

});
