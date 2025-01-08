// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {EventTicket} from "../src/EventTicket.sol";

contract DeployEventTicket is Script {
    function run() external returns (EventTicket) {
        vm.startBroadcast();
        
        EventTicket eventTicket = new EventTicket(
            "Event Ticket",  // name
            "ETKT",         // symbol
            100,            // maxSupply
            0.01 ether      // price
        );
        
        vm.stopBroadcast();
        return eventTicket;
    }
}

// Deployer: 0xDEFdb1c256FC638408a21044015b7b3fdD2E19f1
// Deployed to: 0x5Af1cbb37b255871c92432899be7CC2DA528FBE5
// Transaction hash: 0x58825bc76e8395464788a0272da12b03d42b584e51a94394273ea5b92fb5b5a2