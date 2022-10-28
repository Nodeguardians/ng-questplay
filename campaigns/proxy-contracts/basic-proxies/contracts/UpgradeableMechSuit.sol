// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract UpgradeableMechSuit {

    constructor(address _implementation) {
        assembly {
            sstore(0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc, _implementation)
            sstore(0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103, caller())
        }
    }

    /// @notice Upgrades contract by updating the linked logic contract
    /// @param _implementation Address of new logic contract to be linked
    function upgradeTo(address _implementation) external {
        assembly {
            if eq(sload(0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103), caller()) { revert(0, 0) }
            sstore(0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103, _implementation)
        }
    }

    fallback() external payable {
        assembly {
            calldatacopy(0,  0, calldatasize())

            let result := delegatecall(gas(), sload(0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103), 0, calldatasize(), 0, 0)

            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

}