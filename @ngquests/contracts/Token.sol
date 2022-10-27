// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @dev Test token with minting capabilities
contract Token is ERC20, Ownable {

    constructor(
        string memory name, 
        string memory symbol
    ) ERC20(name, symbol) Ownable() { 
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

}