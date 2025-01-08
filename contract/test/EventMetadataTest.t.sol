// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {EventMetadata} from "../src/EventMetadata.sol";

contract EventMetadataTest is Test {
    EventMetadata private eventMetadata;
    address private nonOwner = address(2);

    function setUp() public {
        eventMetadata = new EventMetadata(address(this));
    }

    function testOwnerCanSetEventDetails() public {
        eventMetadata.setEventDetails(
            "Test Event",
            "Test Description",
            "Test Location",
            block.timestamp,
            "ipfs://test"
        );
    }

    function testNonOwnerCannotSetEventDetails() public {
        vm.prank(nonOwner);
        vm.expectRevert(
            abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", nonOwner)
        );
        eventMetadata.setEventDetails(
            "Test Event",
            "Test Description",
            "Test Location",
            block.timestamp,
            "ipfs://test"
        );
    }
}
