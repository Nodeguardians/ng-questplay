const { cheating } = require("@ngquests/test-helpers");
const { ethers } = require("hardhat");
const { testIf } = require("./testsuites/testIf");

inputs = [
  {
    name: "Public Test 1",
    minutes: ethers.BigNumber.from(60)
  },
  {
    name: "Public Test 2",
    minutes: ethers.BigNumber.from(-1)
  }
]

describe("If (Part 4)", function() {
  inputs.forEach(testIf);

  cheating.testAssemblyAll("contracts/If.sol");
  cheating.testExternalCode("contracts/If.sol");
});
