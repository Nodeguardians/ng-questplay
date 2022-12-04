const { ethers } = require("hardhat");
const { expect } = require("chai");

function testFor(input) {
  describe(input.name, function () {
    before(async function () {
      const ForFactory = await ethers.getContractFactory("For");
      _for = await ForFactory.deploy();
      await _for.deployed();
    });

    it("Should sum elements", async function () {

        let expectedSum = 0;

        for (let i = input.beg; i < input.end; i++) {
          if (i % 5 == 0) {
            continue;
          }

          if (input.end % i == 0) {
            break;
          }

          expectedSum += i;
        }

      expect(await _for.sumElements(input.beg, input.end))
        .to.equal(expectedSum);
    });
  });
}

module.exports.testFor = testFor;
