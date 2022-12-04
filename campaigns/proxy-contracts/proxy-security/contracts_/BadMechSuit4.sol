// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BadMechSuit4 {
    
    address impl;

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

    function upgradeTo(uint8 mode) external {
        impl = address(new MultiSuitLogic());
        (bool result, ) = address(this).call(
            abi.encodeWithSignature("initialize(uint8)", mode)
        );
        require(result);
    }

    function shootTrustyRockets(uint128 x, uint128 y) external view returns (bytes32) {
        require(!_isUpgraded());
        return keccak256(abi.encode("SHOOT SHOOT", x, y));
    }

    function _isUpgraded() private view returns (bool) {
        return impl != address(0);
    }
}

contract MultiSuitLogic {

    bytes32 private DO_NOT_USE;
    uint8 public mode;

    function initialize(uint8 _mode) external {
        require(mode == 0, "Suit already initialised!");
        require(_mode > 0 && _mode < 6);
        mode =  _mode;
    }

    function throwIronAxe(uint16 x) external view returns (bytes32) {
        require(mode == 1);
        return keccak256(abi.encode("WATCH OUT", x));
    }

    function crackElectricWhip(bool x, bool y) external view returns (bytes32) {
        require(mode == 2);
        return keccak256(abi.encode("THWIIP", x, y));
    }

    function castPoisonKnives(uint32 x, uint8 y) external view returns (bytes32) {
        require(mode == 3);
        return keccak256(abi.encode("SNIKT SNIKT", x, y));
    }

    function lungeGiantBlade(uint32 x) external view returns (bytes32) {
        require(mode == 4);
        return keccak256(abi.encode("VERY BIG BLADE", x));
    }

    function tossFireBombs(uint32 x) external view returns (bytes32) {
        require(mode == 5);
        return keccak256(abi.encode("KABOOM", x));
    }


}