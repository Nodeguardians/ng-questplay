const { ethers } = require("hardhat");
const { expect } = require("chai");

// Returns true if BigNumber `x` is in range of int256. False otherwise.
function inBounds(x) {
  return x.gte(ethers.constants.MinInt256) 
    && x.lte(ethers.constants.MaxInt256);
}

function testSafeMath(input) {

  describe(input.name, function () {
    before(async function () {
      const SafeMathFactory = await ethers.getContractFactory("SafeMath");

      safeMath = await SafeMathFactory.deploy();

      await safeMath.deployed();
    });

    it("Should add", async function () {
      const [lhs, rhs] = input.add.map(ethers.BigNumber.from);

      const result = lhs.add(rhs);
      if (inBounds(result)) {
        expect(await safeMath.add(lhs, rhs)).to.equal(result);
      } else {
        await expect(safeMath.add(lhs, rhs)).to.be.reverted;
      }
    });

    it("Should subtract", async function () {
      const [lhs, rhs] = input.sub.map(ethers.BigNumber.from);

      const result = lhs.sub(rhs);
      if (inBounds(result)) {
        expect(await safeMath.sub(lhs, rhs)).to.equal(result);
      } else {
        await expect(safeMath.sub(lhs, rhs)).to.be.reverted;
      }
    });

    it("Should multiply", async function () {
      const [lhs, rhs] = input.mul.map(ethers.BigNumber.from);

      const result = lhs.mul(rhs);
      if (inBounds(result)) {
        expect(await safeMath.mul(lhs, rhs)).to.equal(result);
      } else {
        await expect(safeMath.mul(lhs, rhs)).to.be.reverted;
      }
    });

    it("Should divide", async function () {
      const [lhs, rhs] = input.div.map(ethers.BigNumber.from);

      if (rhs.eq(ethers.constants.Zero)) {
        await expect(safeMath.div(lhs, rhs)).to.be.reverted;
        return;
      }

      const result = lhs.div(rhs);
      if (inBounds(result)) {
        expect(await safeMath.div(lhs, rhs)).to.equal(result);
      } else {
        await expect(safeMath.div(lhs, rhs)).to.be.reverted;
      }
    });
  });
}

module.exports.testSafeMath = testSafeMath;