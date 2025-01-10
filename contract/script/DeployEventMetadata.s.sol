// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {EventMetadata} from "../src/EventMetadata.sol";

contract DeployEventMetadata is Script {
    function run() public {
        vm.startBroadcast();

        EventMetadata eventMetadata = new EventMetadata(msg.sender);

        eventMetadata.setEventDetails(
            "MyEvent",
            "A fantastic event on chain",
            "New York",
            block.timestamp + 30 days,
            "ipfs://QmExample..."
        );

        vm.stopBroadcast();
    }
}

// Deployer: 0xDEFdb1c256FC638408a21044015b7b3fdD2E19f1
// Deployed to: 0x58BdCfe169388619209d81A12ca66472d776087b
// Transaction hash: 0x4953005ca0413e13de02263e07f43d9f9561f09d657056cb8cd9fe9a40f9f200