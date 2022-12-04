const { ethers } = require("hardhat");
const { expect } = require("chai");

function testSwitch(input) {
  describe(input.name, function () {
    before(async function () {
      const SwitchFactory = await ethers.getContractFactory("Switch");
      _switch = await SwitchFactory.deploy();
      await _switch.deployed();
    });

    it("getDirection() should work", async function () {

      const directions = ["0x6c65667400000000", "0x7269676874000000", "0x666f727761726400", "0x6261636b77617264"];

      const expected = directions[ethers.BigNumber.from(input.id)
        .mod(ethers.BigNumber.from(4)).toNumber()];

      expect(await _switch.getDirection(input.id)).to.equal(expected);
    });
  });
}

module.exports.testSwitch = testSwitch;
