// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BanditCamp {

    uint256 public bandits = 8;
    
    function clearCamp() external {
        bandits = 0;
    }
    
}