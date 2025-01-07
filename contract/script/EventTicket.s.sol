// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/EventTicket.sol";

contract DeployEventTicket is Script {
    function run() external {
        // Define deployment parameters
        string memory name = "Event Ticket";
        string memory symbol = "ETKT";
        uint256 maxSupply = 100; // Maximum number of tickets
        uint256 price = 0.01 ether; // Price per ticket

        // Start broadcasting transactions
        vm.startBroadcast();

        // Deploy the contract
        EventTicket eventTicket = new EventTicket(name, symbol, maxSupply, price);

        // Stop broadcasting
        vm.stopBroadcast();

        // Log the deployed contract address
        console.log("EventTicket deployed at:", address(eventTicket));
    }
}
