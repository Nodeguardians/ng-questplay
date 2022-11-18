const { ethers } = require("hardhat");

function closeTo(expected, threshold) {
  return function (x) {
    const bigX = ethers.BigNumber.from(x);
    return bigX.sub(expected).abs().lte(threshold);
  }
}

module.exports.closeTo = closeTo;