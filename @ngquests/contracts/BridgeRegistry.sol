// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract BridgeRegistry {

    mapping(bytes32 => bool) public bridgeHashes;

    function registerMessage(bytes calldata _message) external returns (bytes32 bridgeHash) {
        bridgeHash = keccak256(abi.encode(msg.sender, _message));
        bridgeHashes[bridgeHash] = true;
    }

}
