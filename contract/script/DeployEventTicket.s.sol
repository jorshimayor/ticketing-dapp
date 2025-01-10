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
            0.01 ether,     // price
            "https://api.example.com/metadata/" // baseTokenURI
        );
        
        vm.stopBroadcast();
        return eventTicket;
    }
}

// Deployer: 0xDEFdb1c256FC638408a21044015b7b3fdD2E19f1
// Deployed to: 0x06785D59FAE4a2CB267B0afE3Ce6F1896872Bb48
// Transaction hash: 0x863a3b1538cea1827073fef5aaeb14426070bc6c741476145fe6dd30d1f6c7a0