// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC3156FlashLender.sol";

contract SingleTokenFlashLender is IERC3156FlashLender {

    bytes32 constant CALLBACK_SUCCESS = keccak256("ERC3156FlashBorrower.onFlashLoan");

    IERC20 public immutable token;
    
    constructor(IERC20 _token) {
        token = _token;
    }

    function maxFlashLoan(
        address _token
    ) public view returns (uint256) {

        if (_token != address(token)) {
            return 0;
        }

        return token.balanceOf(address(this));

    }

    function flashFee(
        address _token,
        uint256 /*amount*/
    ) external view returns (uint256) {
        require(_token != address(token), "FlashLender: Unsupported currency");

        return 0; // This flash loan is free!
    }

    function flashLoan(
        IERC3156FlashBorrower receiver,
        address _token,
        uint256 _amount,
        bytes calldata _data
    ) external returns (bool) {

        require(address(token) == _token, "FlashLender: Unsupported currency");

        bool transferResult = token.transfer(address(receiver), _amount);
        require(transferResult, "FlashLender: Transfer failed");

        bytes32 callBackResult = receiver.onFlashLoan(
            msg.sender, 
            _token, 
            _amount,
            0, 
            _data
        );
        require(callBackResult == CALLBACK_SUCCESS, "FlashLender: Callback failed");

        bool repayResult = token.transferFrom(
            address(receiver), 
            address(this), 
            _amount
        );
        require(repayResult, "FlashLender: Repay failed");

        return true;

    }
    
}
