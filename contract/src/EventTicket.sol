// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// EventTicket contract allows users to mint event tickets (ERC721 NFTs),
// verifies tickets using signatures, and tracks verifiers.
contract EventTicket is ERC721, Ownable {
    using Counters for Counters.Counter; // Allows us to use the counter for incrementing token IDs
    using ECDSA for bytes32; // For recovering the signer from the signature

    // Counter for the token IDs, ensuring each NFT has a unique ID
    Counters.Counter private _tokenIds;
    
    // Maximum supply of tickets that can be minted
    uint256 public maxSupply;

    // Price per ticket (in wei)
    uint256 public price;

    // Boolean to toggle the sale state (whether tickets can be minted)
    bool public saleActive;

    // Mapping to track whether a ticket has been verified by a verifier
    mapping(uint256 => bool) public isVerified;

    // Mapping to track authorized verifiers (addresses that can verify tickets)
    mapping(address => bool) public isVerifier;
    
    // Event emitted when a ticket is verified
    event TicketVerified(uint256 tokenId, address verifier);

    // Constructor to initialize the contract with name, symbol, max supply, and price
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _price
    ) ERC721(_name, _symbol) {
        maxSupply = _maxSupply; // Maximum number of tickets that can be minted
        price = _price;         // Price for each ticket
    }

    // Function for the owner to add a new verifier address (can be used to approve third parties)
    function addVerifier(address verifier) external onlyOwner {
        isVerifier[verifier] = true; // Set the verifier to true, allowing them to verify tickets
    }

    // Function to verify a ticket using a signature
    function verifyTicket(uint256 tokenId, bytes memory signature) external {
        // Check that the sender is an authorized verifier
        require(isVerifier[msg.sender], "Not authorized verifier");

        // Ensure the ticket has not already been verified
        require(!isVerified[tokenId], "Ticket already verified");

        // Compute the message hash to be signed, based on the ticket ID and contract address
        bytes32 messageHash = keccak256(abi.encodePacked(tokenId, address(this)));

        // Convert the message hash into a form suitable for signing
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        // Recover the signer's address from the signature
        address signer = ethSignedMessageHash.recover(signature);

        // Ensure the signer is the owner of the ticket
        require(signer == ownerOf(tokenId), "Invalid signature");

        // Mark the ticket as verified
        isVerified[tokenId] = true;

        // Emit an event to notify that the ticket has been verified
        emit TicketVerified(tokenId, msg.sender);
    }

    // Function to mint a ticket, only if the sale is active and the user sends enough payment
    function mintTicket() external payable {
        // Ensure the sale is active
        require(saleActive, "Sale is not active");

        // Ensure the user sent enough ETH to cover the price of a ticket
        require(msg.value >= price, "Insufficient payment");

        // Ensure we haven't reached the maximum supply of tickets
        require(_tokenIds.current() < maxSupply, "Max supply reached");

        // Increment the token ID and mint the ticket to the user's address
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // Mint the ticket (ERC721 NFT) and assign it to the sender
        _safeMint(msg.sender, newTokenId);
    }

    // Function to toggle the sale state (only accessible by the owner)
    function toggleSale() external onlyOwner {
        saleActive = !saleActive; // Toggle the sale state
    }
}
