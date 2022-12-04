const { ethers } = require("hardhat");
const { expect } = require("chai");

function testArithmetic(input) {
  describe(input.name, function () {
    before(async function () {
      const arithmeticFactory = await ethers.getContractFactory(
        "Arithmetic"
      );
      arithmetic = await arithmeticFactory.deploy();

      await arithmetic.deployed();
    });

    it("Should add", async () => {
      const [lhs, rhs] = input.addition.map(ethers.BigNumber.from);
      expect(await arithmetic.addition(lhs, rhs)).to.equal(lhs.add(rhs));
    });

    it("Should multiply", async () => {
      const [lhs, rhs] = input.multiplication.map(ethers.BigNumber.from);
      expect(await arithmetic.multiplication(lhs, rhs)).to.equal(lhs.mul(rhs));
    });
   
    it("Should divide (signed)", async () => {
      const [lhs, rhs] = input.signedDivision.map(ethers.BigNumber.from);

      expect(await arithmetic.signedDivision(lhs, rhs))
        .to.equal(lhs.div(rhs));
    });

    it("Should modulo", async () => {
      const [lhs, rhs] = input.modulo.map(ethers.BigNumber.from);
      expect(await arithmetic.modulo(lhs, rhs))
        .to.equal(lhs.mod(rhs));
    });

    it("Should exponentiate (i.e. power)", async () => {
      const [lhs, rhs] = input.power.map(ethers.BigNumber.from);
      expect(await arithmetic.power(lhs, rhs))
        .to.equal(lhs.pow(rhs));
    });
    
  });
}

module.exports.testArithmetic = testArithmetic;