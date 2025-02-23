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

/**
 * Deployer: 0xEEE5BEC08C3fd98535183c247931FFC439778A7C
 * Deployed to: 0xe73b5cDEBB5dbC4206D525AdF41aAc84Ab6fB019
 * Transaction hash: 0x3edf0adddefe6dd7856a5fe92d4dd1e44408f8d6e2fc81fffea9b25e5a4f8a02
*/