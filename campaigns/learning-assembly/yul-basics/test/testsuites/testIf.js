const { ethers } = require("hardhat");
const { expect } = require("chai");

function testIf(input) {
  describe(input.name, function () {
    before(async function () {
      const IfFactory = await ethers.getContractFactory("If");
      _if = await IfFactory.deploy();
      await _if.deployed();
    });

    it("Should convert minutes to hours", async function () {

      if (input.minutes.lt(ethers.constants.Zero) || input.minutes.mod(60).eq(ethers.constants.Zero) == false) {
        await expect(_if.minutesToHours(input.minutes)).to.be.reverted;
      }

      else {
        expect(await _if.minutesToHours(input.minutes)).to.equal(input.minutes.div(60));
      }
    });
  });
}

module.exports.testIf = testIf;