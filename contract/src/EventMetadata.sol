// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

// EventMetadata contract allows the owner to store and manage event details
contract EventMetadata is Ownable {
    
    // Struct to store event details (name, description, location, date, and IPFS hash)
    struct Event {
        string name;          // Event name
        string description;   // Event description
        string location;      // Event location
        uint256 date;         // Event date (timestamp)
        string ipfsHash;      // IPFS hash for event media or additional data
    }
    
    // Public variable to store the event details
    Event public eventDetails;

    // Function to set or update event details
    // This function can only be called by the contract owner (inherits from Ownable)
    function setEventDetails(
        string memory _name,
        string memory _description,
        string memory _location,
        uint256 _date,
        string memory _ipfsHash
    ) external onlyOwner {
        // Setting the event details by updating the eventDetails struct
        eventDetails = Event(_name, _description, _location, _date, _ipfsHash);
    }
}
