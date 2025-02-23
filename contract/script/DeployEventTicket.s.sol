// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {EventTicket} from "../src/EventTicket.sol";

contract DeployEventTicket is Script {
    function run() external returns (EventTicket) {
        vm.startBroadcast();
        
        EventTicket eventTicket = new EventTicket(
            "Event Ticket", // name
            "ETKT",         // symbol
            100,            // maxSupply
            0.01 ether,     // price
            "ipfs://bafkreiecyl25mfeoz3hvksh2gglidv5ab47l6bztawjm53apg3es3fcccy/" // baseTokenURI
        );
        
        vm.stopBroadcast();
        return eventTicket;
    }
}

/**
 * Deployer: 0xEEE5BEC08C3fd98535183c247931FFC439778A7C
 * Deployed to: 0x3C30f4dFB2370eFC5f8E0064181a370A1C9315d2
 * Transaction hash: 0xd8059e98b73ae7be976fd6c81b0afd1aee8cb559db0cce7b5e11304b375312ef
*/