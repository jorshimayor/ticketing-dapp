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
// Deployed to: 0xc1B502126935c6eBaa78Ad915e86f487e1D2f356
// Transaction hash: 0xc5c51fae657bfa9592274f4756d584f6ced7fc34e7609ccf0fa95564e3a8eb97
