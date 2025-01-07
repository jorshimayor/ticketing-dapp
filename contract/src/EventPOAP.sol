// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev EventPOAP contract allows users to redeem a POAP (Proof of Attendance Protocol) NFT
 * based on the ownership of an EventTicket NFT from another contract.
 */

contract EventPOAP is ERC721, Ownable {
    
    // Mapping to track whether a ticket has already been redeemed for a POAP NFT
    mapping(uint256 => bool) public ticketRedeemed;
    
    // Address of the EventTicket contract (the original event ticket NFT contract)
    address public eventTicketContract;
    
    // Constructor to initialize the contract
    // _name and _symbol are passed to ERC721 for POAP token details
    // _eventTicketContract is the address of the EventTicket contract
    constructor(
        string memory _name,
        string memory _symbol,
        address _eventTicketContract
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        eventTicketContract = _eventTicketContract; // Set the EventTicket contract address
    }
    
    // Function to redeem POAP by providing the ticket's token ID
    // The ticket must not have been redeemed yet
    // The sender must be the owner of the ticket
    function redeemPOAP(uint256 ticketTokenId) external {
        // Ensure that the sender is the owner of the ticket NFT
        require(
            msg.sender == ERC721(eventTicketContract).ownerOf(ticketTokenId),
            "Not ticket owner"
        );
        // Ensure that the ticket has not been redeemed before
        require(!ticketRedeemed[ticketTokenId], "Ticket already redeemed");
        // Mark the ticket as redeemed
        ticketRedeemed[ticketTokenId] = true;
        // Mint the POAP NFT to the sender's address
        _safeMint(msg.sender, ticketTokenId);
    }
    
    // Function for the contract owner to update the EventTicket contract address
    function updateEventTicketContract(
        address newEventTicketContract
    ) external onlyOwner {
        eventTicketContract = newEventTicketContract;
    }
}
