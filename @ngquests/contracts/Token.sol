// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev Test token with minting capabilities
/// Clone-friendly for cheaper gas in CTF quests
contract Token is ERC20 {

    string private _name;
    string private _symbol;

    address private owner;
    bool private isInitialized;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    constructor() ERC20("", "") { }

    function initialize(
        string memory name_,
        string memory symbol_
    ) external {
        require(!isInitialized, "Token already initialized");

        _name = name_;
        _symbol = symbol_;

        owner = msg.sender;
        isInitialized = true;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

}