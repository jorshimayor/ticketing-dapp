// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {EventTicket} from "../src/EventTicket.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract EventTicketTest is Test {
    EventTicket private eventTicket;
    
    address private owner = address(this);
    address private user = address(0x123);
    address private verifier = address(0x456);

    uint256 private maxSupply = 5;
    uint256 private price = 0.01 ether;

    function setUp() public {
        // Deploy the contract
        eventTicket = new EventTicket("Event Ticket", "ETKT", maxSupply, price);
    }

    function testOwnerCanToggleSale() public {
        // Initially saleActive should be false
        assertFalse(eventTicket.saleActive());
        // Toggle sale
        eventTicket.toggleSale();
        assertTrue(eventTicket.saleActive());
    }

    function testMintTicket() public {
        // Enable sale
        eventTicket.toggleSale();

        // Start with no tickets minted
        assertEq(eventTicket.balanceOf(user), 0);

        // Mint a ticket
        vm.prank(user); // Mock transaction as `user`
        eventTicket.mintTicket{value: price}();

        // Check the balance of the user and total supply
        assertEq(eventTicket.balanceOf(user), 1);
        assertEq(eventTicket.ownerOf(1), user);
    }

    function testMintFailsWithoutEnoughPayment() public {
        // Enable sale
        eventTicket.toggleSale();

        // Attempt to mint without enough ETH
        vm.prank(user);
        vm.expectRevert("Insufficient payment");
        eventTicket.mintTicket{value: price - 1}();
    }

    function testMintFailsWhenMaxSupplyReached() public {
        // Enable sale
        eventTicket.toggleSale();

        // Mint max supply of tickets
        for (uint256 i = 0; i < maxSupply; i++) {
            vm.prank(user);
            eventTicket.mintTicket{value: price}();
        }

        // Attempt to mint another ticket
        vm.prank(user);
        vm.expectRevert("Max supply reached");
        eventTicket.mintTicket{value: price}();
    }

    function testVerifyTicket() public {
        // Enable sale and mint a ticket
        eventTicket.toggleSale();
        vm.prank(user);
        eventTicket.mintTicket{value: price}();

        // Add a verifier
        eventTicket.addVerifier(verifier);

        // Prepare a signature
        bytes32 messageHash = keccak256(abi.encodePacked(uint256(1), address(eventTicket)));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(uint256(uint160(user)), ethSignedMessageHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // Verify the ticket
        vm.prank(verifier);
        eventTicket.verifyTicket(1, signature);

        // Check that the ticket is verified
        assertTrue(eventTicket.isVerified(1));
    }

    function testVerifyFailsWithInvalidSignature() public {
        // Enable sale and mint a ticket
        eventTicket.toggleSale();
        vm.prank(user);
        eventTicket.mintTicket{value: price}();

        // Add a verifier
        eventTicket.addVerifier(verifier);

        // Prepare an invalid signature
        bytes memory invalidSignature = "0x00";

        // Attempt to verify the ticket
        vm.prank(verifier);
        vm.expectRevert("Invalid signature");
        eventTicket.verifyTicket(1, invalidSignature);
    }

    function testWithdraw() public {
        // Enable sale and mint a ticket
        eventTicket.toggleSale();
        vm.prank(user);
        eventTicket.mintTicket{value: price}();

        // Withdraw funds
        eventTicket.withdraw();
    }
}
