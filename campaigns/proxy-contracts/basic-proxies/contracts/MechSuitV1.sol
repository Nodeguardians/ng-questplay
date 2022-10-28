// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MechSuitV1 {

    // Space reserved for UpgradeableMechSuit to store delegate address

    uint32 public fuel;

    function swingHammer() external returns (bytes32) {
        fuel -= 10;
        return keccak256("HAMMER SMASH!!!");
    }

    function refuel() external payable {
        require(msg.value == 1 gwei);
        fuel = 100;
    }

}