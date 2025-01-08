// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {EventTicket} from "../src/EventTicket.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract EventTicketTest is Test {
    EventTicket private eventTicket;
    
    address private owner;
    address private user = address(0x123);
    address private verifier = address(0x456);
    uint256 private maxSupply = 5;
    uint256 private price = 0.01 ether;

    function setUp() public {
        // Set owner to the test contract
        owner = address(this);
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

        // Give user some ETH
        vm.deal(user, price);

        // Start with no tickets minted
        assertEq(eventTicket.balanceOf(user), 0);

        // Mint a ticket
        vm.prank(user);
        eventTicket.mintTicket{value: price}();

        // Check the balance of the user and total supply
        assertEq(eventTicket.balanceOf(user), 1);
        assertEq(eventTicket.ownerOf(1), user);
    }

    function testMintFailsWithoutEnoughPayment() public {
        // Enable sale
        eventTicket.toggleSale();

        // Give user some ETH, but less than price
        vm.deal(user, price - 1);

        // Attempt to mint without enough ETH
        vm.prank(user);
        vm.expectRevert("Insufficient payment");
        eventTicket.mintTicket{value: price - 1}();
    }

    function testMintFailsWhenMaxSupplyReached() public {
        // Enable sale
        eventTicket.toggleSale();

        // Give user enough ETH for all tickets
        vm.deal(user, price * maxSupply);

        // Mint max supply of tickets
        for (uint256 i = 0; i < maxSupply; i++) {
            vm.prank(user);
            eventTicket.mintTicket{value: price}();
        }

        // Give user more ETH for one more ticket
        vm.deal(user, price);

        // Attempt to mint another ticket
        vm.prank(user);
        vm.expectRevert("Max supply reached");
        eventTicket.mintTicket{value: price}();
    }
}
