// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BadMechSuit2 {
    
    address private impl;

    constructor() {
        impl = address(new SuitLogicV1());
        (bool result ,) = impl.delegatecall(
            abi.encodeWithSignature("initialize()")
        );
        require(result);
    }

    /// @dev You can safely assume this fallback function works safely!
    fallback() external {
        address _impl = impl;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), _impl, 0, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(0, 0, size)

            switch result
            case 0 { revert(0, size) }
            default { return(0, size) }
        }
    }

    function upgrade() external {
        impl = address(new SuitLogicV2());
    }

}

contract SuitLogicV1 {

    bytes32 DO_NOT_USE;
    uint32 ammunition;
    uint32 fuel;

    function initialize() external {
        ammunition = 8;
        fuel = 100; 
    }

    function fireCrossbow(uint times) external returns (bytes32) {
        ammunition -= uint32(times);
        return keccak256("pew! pew! pew!");
    }

}

contract SuitLogicV2 {

    bytes32 DO_NOT_USE;
    uint32 fuel;

    function swingSword() external view returns (bytes32) {
        require (fuel > 0);
        return keccak256("SHING, SHING");
    }

}