// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Switch {
    
    /// @notice Maps the given id to a corresponding direction. 
    /// Returns "left" if id % 4 == 0.
    /// Returns "right" if id % 4 == 1.
    /// Returns "forward" if id % 4 == 2.
    /// Returns "backward" if id % 4 == 3.
    function getDirection(uint256 id)
        public
        pure
        returns (bytes8 direction)
    {
        assembly {
            switch mod(id, 4)
            case 0 {
                direction:="left"
            }
            case 1 {
                direction:="right"
            }
            case 2 {
                direction:="forward"
            }
            case 3 {
                direction:="backward"
            }
        }
    }
}
