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
