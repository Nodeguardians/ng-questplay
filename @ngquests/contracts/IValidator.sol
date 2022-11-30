// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IValidator {

    /// @dev Returns address of contract belonging to `user` in part `k` of quest.
    function deployments(address user, uint k) external view returns (address);

    
    /// @dev Deploys CTF contract for user to interact with.
    function deploy(uint k) external;


    /// @dev Tests whether contract belonging to `user` in part `k` has been "captured".
    /// Returns true if contract "captured", false otherwise.
    function test(address user, uint k) external view returns (bool);

    /// @dev Returns name of contract to be deployed for part `k`.
    function contractName(uint k) external pure returns (string memory);

}