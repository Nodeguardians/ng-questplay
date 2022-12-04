const { cheating } = require("@ngquests/test-helpers");
const { ethers } = require("hardhat");
const { testComparisons } = require("./testsuites/testComparisons");

input = {
  name: "Public Test 1",
  isZero: [0, 1],
  greaterThan: [[1, 0], [1, 2]],
  signedLowerThan: [[-1, 0], [1, -1]],
  isNegativeOrEqualTen: [1, -10, 0, 10, 11],
  isInRange: [
    [10, 11, 12], 
    [10, 9, 10], 
    [10, 8, 9], 
    [10, 10, 11]
  ]
}

describe("Comparisons (Part 3)", function() {
  testComparisons(input);

  cheating.testAssemblyAll("contracts/Comparisons.sol");
  cheating.testExternalCode("contracts/Comparisons.sol");
});
