const { ethers } = require("hardhat");
const { expect } = require("chai");

function testComparisons(input) {
  describe(input.name, function () {
    before(async function () {
      const ComparisonsFactory = await ethers.getContractFactory("Comparisons");
      comparisons = await ComparisonsFactory.deploy();
      await comparisons.deployed();
    });

    it("isZero() should work", async () => {
      for (const value of input.isZero.map(ethers.BigNumber.from)) {
        const expected = value.eq(ethers.constants.Zero);
        expect(await comparisons.isZero(value)).to.equal(expected);
      }
    });

    it("greaterThan() should work", async () => {
      for (let testcase of input.greaterThan) {
        const [lhs, rhs] = testcase.map(ethers.BigNumber.from);
        const expected = lhs.gt(rhs)
        expect(await comparisons.greaterThan(lhs, rhs)).to.equal(expected);
      }
    });

    it("signedLowerThan() should work", async () => {
      for (const testcase of input.signedLowerThan) {
        const [lhs, rhs] = testcase.map(ethers.BigNumber.from);
        const expected = lhs.lt(rhs);
        expect(await comparisons.signedLowerThan(lhs, rhs)).to.equal(expected);
      }
    });

    it("negativeOrEqualTen() should work", async () => {
      for (const value of input.isNegativeOrEqualTen.map(ethers.BigNumber.from)) {
        const expected = value.lt(ethers.constants.Zero) 
          || value.eq(ethers.BigNumber.from('10'));
        expect(await comparisons.isNegativeOrEqualTen(value))
          .to.equal(expected);
      }
    });

    it("isInRange() should work", async () => {
      for (const testcase of input.isInRange) {
        const [value, lower, upper] = testcase.map(ethers.BigNumber.from);
        const expected = value.gte(lower) && value.lte(upper);
        expect(await comparisons.isInRange(value, lower, upper))
          .to.equal(expected);
      }
    });
  });
}

module.exports.testComparisons = testComparisons;