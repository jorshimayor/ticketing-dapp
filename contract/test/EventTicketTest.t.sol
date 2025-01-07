// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./EventTicket.sol";

contract EventTicketTest is Test {
    EventTicket public eventTicket;
    address public user;
    address public verifier;

    function setUp() public {
        // Deploy the EventTicket contract with name, symbol, max supply, and price
        eventTicket = new EventTicket("Event Ticket", "ETICKET", 100, 0.1 ether);

        // Create test user and verifier addresses
        user = address(0x123);
        verifier = address(0x456);

        // Add the verifier address as an authorized verifier
        vm.startPrank(owner);
        eventTicket.addVerifier(verifier);
        vm.stopPrank();
    }

    // Test minting of tickets
    function testMintTicket() public {
        // Check that the user doesn't own any tickets yet
        assertEq(eventTicket.balanceOf(user), 0);

        // Start the sale
        vm.startPrank(owner);
        eventTicket.toggleSale();
        vm.stopPrank();

        // User sends enough ether to mint a ticket
        vm.startPrank(user);
        eventTicket.mintTicket{value: 0.1 ether}();
        vm.stopPrank();

        // Check that the user now owns one ticket
        assertEq(eventTicket.balanceOf(user), 1);
    }

    // Test that a user cannot mint a ticket if the sale is not active
    function testCannotMintWithoutActiveSale() public {
        // Check that the user cannot mint a ticket when the sale is inactive
        vm.startPrank(user);
        vm.expectRevert("Sale is not active");
        eventTicket.mintTicket{value: 0.1 ether}();
        vm.stopPrank();
    }

    // Test that a verifier can verify a ticket
    function testVerifyTicket() public {
        // Start the sale to mint a ticket for the user
        vm.startPrank(owner);
        eventTicket.toggleSale();
        vm.stopPrank();

        vm.startPrank(user);
        eventTicket.mintTicket{value: 0.1 ether}();
        uint256 tokenId = 0; // The first minted ticket
        vm.stopPrank();

        // Generate a signature for the ticket from the owner
        bytes32 messageHash = keccak256(abi.encodePacked(tokenId, address(eventTicket)));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, ethSignedMessageHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // Verify the ticket with the correct signature
        vm.startPrank(verifier);
        eventTicket.verifyTicket(tokenId, signature);
        vm.stopPrank();

        // Ensure the ticket is marked as verified
        assertTrue(eventTicket.isVerified(tokenId));
    }

    // Test that a non-verifier cannot verify a ticket
    function testCannotVerifyWithoutAuthorization() public {
        // Generate a signature for the ticket from the owner
        bytes32 messageHash = keccak256(abi.encodePacked(0, address(eventTicket)));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, ethSignedMessageHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // Try to verify the ticket as a non-verifier (should fail)
        vm.startPrank(user);
        vm.expectRevert("Not authorized verifier");
        eventTicket.verifyTicket(0, signature);
        vm.stopPrank();
    }
}
