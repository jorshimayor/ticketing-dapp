// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {EventPOAP} from "../src/EventPOAP.sol";

contract DeployEventPOAP is Script {
    function run() external returns (EventPOAP) {
        address eventTicketAddress = vm.envAddress("EVENT_TICKET_ADDRESS");
        
        vm.startBroadcast();
        
        EventPOAP eventPOAP = new EventPOAP(
            "Event POAP",
            "POAP",
            eventTicketAddress
        );
        
        vm.stopBroadcast();
        return eventPOAP;
    }
}

// Deployer: 0xDEFdb1c256FC638408a21044015b7b3fdD2E19f1
// Deployed to: 0x583912eaa68606419ca3A4421bdb3931297c255B
// Transaction hash: 0x3e051b48d6ccdc1d695ecc7678d34b527f7b3467c50210273a8cad3975b74d13
