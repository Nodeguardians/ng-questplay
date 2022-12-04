const { cheating } = require("@ngquests/test-helpers");
const { testSwitch } = require("./testsuites/testSwitch");

inputs = [
  {
    name: "Public Test 1",
    id:  0,
  },
  {
    name: "Public Test 2",
    id: 1,
  },
  {
    name: "Public Test 3",
    id: 2
  },
  {
    name: "Public Test 3",
    id: 3
  }
]

describe("Switch (Part 5)", function() {
  inputs.forEach(testSwitch);

  cheating.testAssemblyAll("contracts/Switch.sol");
  cheating.testExternalCode("contracts/Switch.sol");
});
