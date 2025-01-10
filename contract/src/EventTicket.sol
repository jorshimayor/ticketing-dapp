// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title EventTicket
 * @dev A contract for managing event ticket NFTs with verification capabilities
 * @notice This contract allows users to purchase event tickets as NFTs and have them verified by authorized verifiers
*/

contract EventTicket is ERC721, Ownable {
    uint256 public immutable maxSupply;
    uint256 public immutable price;
    uint256 private _tokenIdCounter;
    bool public saleActive;
    mapping(address => bool) public verifiers;
    mapping(uint256 => bool) public isVerified;
    string public baseTokenURI;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _price,
        string memory _baseTokenURI
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        maxSupply = _maxSupply;
        price = _price;
        baseTokenURI = _baseTokenURI;
    }

    function toggleSale() external onlyOwner {
        saleActive = !saleActive;
    }

    function mintTicket() external payable {
        require(saleActive, "Sale is not active");
        require(msg.value >= price, "Insufficient payment");
        require(_tokenIdCounter < maxSupply, "Max supply reached");

        _tokenIdCounter++;
        _safeMint(msg.sender, _tokenIdCounter);
    }

    function addVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = true;
    }

    function verifyTicket(uint256 tokenId, bytes memory signature) external {
        require(verifiers[msg.sender], "Not authorized verifier");
        require(_exists(tokenId), "Token does not exist");
        
        address ticketOwner = ownerOf(tokenId);
        bytes32 messageHash = keccak256(abi.encodePacked(tokenId, address(this)));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address signer = ECDSA.recover(ethSignedMessageHash, signature);
        
        require(signer == ticketOwner, "Invalid signature");
        
        isVerified[tokenId] = true;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId <= _tokenIdCounter;
    }

    function setBaseURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Nonexistent token");
        return string(abi.encodePacked(baseTokenURI, Strings.toString(tokenId), ".json"));
    }
}
