// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/EventPOAP.sol";
import "../src/EventTicket.sol";

contract DeployEventPOAP is Script {
    function run() public {
        // Deploy Mock EventTicket contract
        EventTicket eventTicket = new EventTicket("Event Ticket", "ETKT", 100, 0.01 ether);
        
        // Deploy EventPOAP contract
        EventPOAP eventPOAP = new EventPOAP("Proof of Attendance", "POAP", address(eventTicket));
        
        // Output deployed contract addresses for verification
        console.log("EventTicket deployed at:", address(eventTicket));
        console.log("EventPOAP deployed at:", address(eventPOAP));
    }
}
