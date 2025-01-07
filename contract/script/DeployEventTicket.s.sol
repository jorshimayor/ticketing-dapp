// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "./EventTicket.sol";

contract DeployEventTicket is Script {
    function run() public {
        // Deploy the EventTicket contract with name, symbol, max supply, and price
        EventTicket eventTicket = new EventTicket("Event Ticket", "ETICKET", 100, 0.1 ether);

        // Output the deployed contract address
        console.log("EventTicket deployed at:", address(eventTicket));
    }
}
