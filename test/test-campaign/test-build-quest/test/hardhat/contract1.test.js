const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Contract (Part 1)", function () {
  let contract;

  before(async function () {
    const Contract = await ethers.getContractFactory("Contract");
    contract = await Contract.deploy();

    await contract.deployed();
  });

  it("foo() should work", async function () {
    expect(contract.foo()).to.not.be.reverted;
  });

});
