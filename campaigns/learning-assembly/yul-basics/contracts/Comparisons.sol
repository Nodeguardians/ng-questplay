// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Comparisons {

    /// @notice Returns value == 0.
    function isZero(int256 value) public pure returns (bool isZero_) {
        assembly {
            isZero_:=iszero(value)
        }
    }

    /// @notice Returns lhs > rhs.
    function greaterThan(uint256 lhs, uint256 rhs)
        public
        pure
        returns (bool greater)
    {
        assembly {
            greater:=gt(lhs, rhs)
        }
    }

    /// @notice Returns lhs < rhs.
    function signedLowerThan(
        int256 lhs, 
        int256 rhs
    ) public pure returns (bool lower) {
        assembly {
            lower:=slt(lhs,rhs)
        }
    }

    /// @notice Returns true if value < 0 or value == 10, false otherwise.
    function isNegativeOrEqualTen(
        int256 value
    ) public pure returns (bool negativeOrEqualTen) {
        assembly {
            negativeOrEqualTen:=or(slt(value, 0), eq(value, 10))
        }
    }

    /// @return inRange true if lower <= value <= upper, false otherwise
    function isInRange(
        int256 value,
        int256 lower,
        int256 upper
    ) public pure returns (bool inRange) {
        assembly {
            inRange:=and(sgt(add(value,1), lower), slt(sub(value,1), upper))
        }
    }
}
