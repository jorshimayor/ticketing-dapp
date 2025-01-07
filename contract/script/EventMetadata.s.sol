// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "./EventMetadata.sol";

contract DeployEventMetadata is Script {
    function run() public {
        // Deploy the EventMetadata contract
        EventMetadata eventMetadata = new EventMetadata();

        // Output the deployed contract address for verification
        console.log("EventMetadata deployed at:", address(eventMetadata));
    }
}
