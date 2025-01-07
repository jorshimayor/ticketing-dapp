// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "./EventMetadata.sol";

contract EventMetadataTest is Test {
    EventMetadata public eventMetadata;
    address public user;

    // Set up the environment before each test
    function setUp() public {
        // Deploy the EventMetadata contract
        eventMetadata = new EventMetadata();
        
        // Create a test user address
        user = address(0x123);
    }

    // Test that only the owner can set event details
    function testSetEventDetails() public {
        // Check initial event details (should be empty)
        assertEq(bytes(eventMetadata.eventDetails().name).length, 0);

        // Start the transaction as the owner (this is the default user address)
        vm.startPrank(owner);
        eventMetadata.setEventDetails("Concert", "A great concert", "New York", block.timestamp, "ipfs://event-ipfs-hash");
        vm.stopPrank();

        // Check that the event details are updated
        EventMetadata.Event memory event = eventMetadata.eventDetails();
        assertEq(event.name, "Concert");
        assertEq(event.description, "A great concert");
        assertEq(event.location, "New York");
        assertEq(event.date, block.timestamp);
        assertEq(event.ipfsHash, "ipfs://event-ipfs-hash");
    }

    // Test that non-owners cannot set event details
    function testCannotSetEventDetailsAsNonOwner() public {
        // Try to set event details as a non-owner (user address)
        vm.startPrank(user);
        vm.expectRevert("Ownable: caller is not the owner");
        eventMetadata.setEventDetails("Concert", "A great concert", "New York", block.timestamp, "ipfs://event-ipfs-hash");
        vm.stopPrank();
    }
}
