// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "forge-std/Test.sol";

contract Contract is Test {

    function foo() external {}

    function bar() external view {
        assertTrue(false, "Should fail");
    }

}
