// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Migrations is Ownable {
    address public lastDeployedAddress;
    uint256 public lastCompletedMigration;

    /**
     * @dev Updates the last completed migration step.
     * @param completed The step number of the last completed migration.
     */
    function setCompleted(uint256 completed) public onlyOwner {
        lastCompletedMigration = completed;
    }

    /**
     * @dev Updates the address of the last deployed contract.
     * @param deployedAddress The address of the last deployed contract.
     */
    function setDeployedAddress(address deployedAddress) public onlyOwner {
        lastDeployedAddress = deployedAddress;
    }
}