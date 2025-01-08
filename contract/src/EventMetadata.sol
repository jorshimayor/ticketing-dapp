// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// A simple contract to store event info (name, description, location, date, IPFS link)
contract EventMetadata is Ownable {
    struct Event {
        string name;
        string description;
        string location;
        uint256 date;
        string ipfsHash;
    }
    
    Event public eventDetails;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setEventDetails(
        string memory _name,
        string memory _description,
        string memory _location,
        uint256 _date,
        string memory _ipfsHash
    ) external onlyOwner {
        eventDetails = Event(_name, _description, _location, _date, _ipfsHash);
    }
}