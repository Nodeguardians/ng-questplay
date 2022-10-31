const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("HelloGuardian (Part 3)", function () {
  let HelloGuardian;
  let helloGuardian;

  before(async function () {
    HelloGuardian = await ethers.getContractFactory("HelloGuardian");
    helloGuardian = await HelloGuardian.deploy();

    await helloGuardian.deployed();
  });

  it("Should say hello", async function () {
    let result = await helloGuardian.hello();
    expect(result).to.be.equals("Hello Guardian");
  });

});
