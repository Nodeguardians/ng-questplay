const { cheating } = require("@ngquests/test-helpers");
const { testFor } = require("./testsuites/testFor");

inputs = [
  { name: "Private Test 1", beg: 4, end: 37 },
  { name: "Private Test 2", beg: 11, end: 11 },
]

describe("For (Part 6)", function() {
  inputs.forEach(testFor)

  cheating.testAssemblyAll("contracts/For.sol");
  cheating.testExternalCode("contracts/For.sol");
});
