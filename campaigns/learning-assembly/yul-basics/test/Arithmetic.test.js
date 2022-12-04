const { cheating } = require("@ngquests/test-helpers");
const { ethers } = require("hardhat");
const { testArithmetic } = require("./testsuites/testArithmetic");

inputs = [
  {
    name: "Public Test 1",
    addition: [2, 1],
    multiplication: [1, -1],
    signedDivision: [-16, 2],
    modulo: [ethers.constants.MaxUint256, 3],
    power: [1, 0]
  }
]

describe("Arithmetic (Part 2)", function() {
  inputs.forEach(testArithmetic)

  cheating.testAssemblyAll("contracts/Arithmetic.sol");
  cheating.testExternalCode("contracts/Arithmetic.sol");
});
