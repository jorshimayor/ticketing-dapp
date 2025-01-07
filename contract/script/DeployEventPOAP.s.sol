// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "./EventPOAP.sol";
import "./MockEventTicket.sol";

contract DeployEventPOAP is Script {
    function run() public {
        // Deploy Mock EventTicket contract
        MockEventTicket mockEventTicket = new MockEventTicket();

        // Deploy EventPOAP contract
        EventPOAP eventPOAP = new EventPOAP("Proof of Attendance", "POAP", address(mockEventTicket));

        // Output deployed contract addresses for verification
        console.log("MockEventTicket deployed at:", address(mockEventTicket));
        console.log("EventPOAP deployed at:", address(eventPOAP));
    }
}
