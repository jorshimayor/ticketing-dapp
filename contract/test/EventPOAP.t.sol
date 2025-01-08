// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {EventPOAP} from "../src/EventPOAP.sol";
import {EventTicket} from "../src/EventTicket.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ERC721ReceiverMock is IERC721Receiver {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}

contract EventPOAPTest is Test, ERC721ReceiverMock {
    EventPOAP private eventPOAP;
    EventTicket private eventTicket;
    
    address private owner;
    address private user;
    uint256 private maxSupply = 5;
    uint256 private price = 0.01 ether;

    function setUp() public {
        // Set owner to the test contract
        owner = address(this);
        // Create user as ERC721ReceiverMock contract
        user = address(new ERC721ReceiverMock());
        
        // Deploy the EventTicket contract
        eventTicket = new EventTicket("Event Ticket", "ETKT", maxSupply, price);
        
        // Deploy the EventPOAP contract
        eventPOAP = new EventPOAP("Event POAP", "POAP", address(eventTicket));
    }

    function testRedeemPOAP() public {
        // Enable sale and mint a ticket
        eventTicket.toggleSale();
        vm.deal(user, price);
        vm.prank(user);
        eventTicket.mintTicket{value: price}();

        // Redeem POAP
        vm.prank(user);
        eventPOAP.redeemPOAP(1);

        // Check that user received the POAP
        assertEq(eventPOAP.ownerOf(1), user);
        assertTrue(eventPOAP.ticketRedeemed(1));
    }

    function testCannotRedeemTicketTwice() public {
        // Enable sale and mint a ticket
        eventTicket.toggleSale();
        vm.deal(user, price);
        vm.prank(user);
        eventTicket.mintTicket{value: price}();

        // Redeem POAP first time
        vm.prank(user);
        eventPOAP.redeemPOAP(1);

        // Try to redeem again
        vm.prank(user);
        vm.expectRevert("Ticket already redeemed");
        eventPOAP.redeemPOAP(1);
    }

    function testCannotRedeemWithoutTicketOwnership() public {
        // Enable sale and mint a ticket to owner
        eventTicket.toggleSale();
        eventTicket.mintTicket{value: price}();

        // Try to redeem with different address
        vm.prank(user);
        vm.expectRevert("Not ticket owner");
        eventPOAP.redeemPOAP(1);
    }

    function testOwnerCanUpdateEventTicketContract() public {
        address newContract = address(0x789);
        eventPOAP.updateEventTicketContract(newContract);
        assertEq(eventPOAP.eventTicketContract(), newContract);
    }

    function testNonOwnerCannotUpdateEventTicketContract() public {
        address newContract = address(0x789);
        vm.prank(user);
        vm.expectRevert(
            abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user)
        );
        eventPOAP.updateEventTicketContract(newContract);
    }
}
