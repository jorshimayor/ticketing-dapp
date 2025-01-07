// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EventPOAP.sol";

contract MockEventTicket is ERC721, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("Event Ticket", "ETICKET") {}

    // Mint function to mint tickets to users
    function mint(address to) external onlyOwner {
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }
}

contract EventPOAPTest is Test {
    EventPOAP public eventPOAP;
    MockEventTicket public mockEventTicket;
    address public user;

    // Setting up the environment for each test case
    function setUp() public {
        // Deploy MockEventTicket contract
        mockEventTicket = new MockEventTicket();
        
        // Deploy EventPOAP contract, passing the address of the mockEventTicket contract
        eventPOAP = new EventPOAP("Proof of Attendance", "POAP", address(mockEventTicket));

        // Create a test user address
        user = address(0x123);
    }

    // Test minting of a POAP NFT by redeeming a ticket
    function testRedeemPOAP() public {
        // Mint a ticket for the user
        mockEventTicket.mint(user);

        // Check that the user does not own a POAP initially
        assertEq(eventPOAP.balanceOf(user), 0);

        // Redeem POAP NFT for the user
        vm.startPrank(user);
        eventPOAP.redeemPOAP(0);
        vm.stopPrank();

        // Verify that the user now owns a POAP NFT
        assertEq(eventPOAP.balanceOf(user), 1);
        assertEq(eventPOAP.ownerOf(0), user);
    }

    // Test that a user cannot redeem a POAP if they don't own the ticket
    function testCannotRedeemWithoutTicketOwnership() public {
        // Mint a ticket to the contract owner, not the user
        mockEventTicket.mint(owner);

        // Try redeeming POAP as the user (who does not own the ticket)
        vm.startPrank(user);
        vm.expectRevert("Not ticket owner");
        eventPOAP.redeemPOAP(0);
        vm.stopPrank();
    }

    // Test that a ticket can only be redeemed once
    function testCannotRedeemTicketTwice() public {
        // Mint a ticket for the user
        mockEventTicket.mint(user);

        // Redeem POAP the first time
        vm.startPrank(user);
        eventPOAP.redeemPOAP(0);
        vm.stopPrank();

        // Try redeeming the same ticket again
        vm.startPrank(user);
        vm.expectRevert("Ticket already redeemed");
        eventPOAP.redeemPOAP(0);
        vm.stopPrank();
    }

    // Test that the owner can update the EventTicket contract address
    function testOwnerCanUpdateEventTicketContract() public {
        // Deploy a new MockEventTicket contract
        MockEventTicket newMockEventTicket = new MockEventTicket();

        // The owner updates the EventTicket contract address
        vm.startPrank(owner);
        eventPOAP.updateEventTicketContract(address(newMockEventTicket));
        vm.stopPrank();

        // Verify that the new address is set
        assertEq(eventPOAP.eventTicketContract(), address(newMockEventTicket));
    }

    // Test that only the owner can update the EventTicket contract address
    function testNonOwnerCannotUpdateEventTicketContract() public {
        // Deploy a new MockEventTicket contract
        MockEventTicket newMockEventTicket = new MockEventTicket();

        // Try updating the EventTicket contract address as a non-owner
        vm.startPrank(user);
        vm.expectRevert("Ownable: caller is not the owner");
        eventPOAP.updateEventTicketContract(address(newMockEventTicket));
        vm.stopPrank();
    }
}
