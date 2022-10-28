require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

require('dotenv').config({ path: '../../../.env' });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  paths: {
    sources: "./contracts_",
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    goerli: {
      url: "https://goerli.nodeguardians.io",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};