import { useState, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext";
import { ethers } from "ethers";

// Import your contract ABI (simplified version)
import EventMetadataABI from "../artifacts/contracts/EventMetadata.sol/EventMetadata.json";

const EventMetadataAddress = "YOUR_EVENT_METADATA_CONTRACT_ADDRESS"; // Replace with your contract address

export default function EventDetails() {
  const { provider } = useWallet();
  const [eventDetails, setEventDetails] = useState<any>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (provider) {
        const contract = new ethers.Contract(
          EventMetadataAddress,
          EventMetadataABI,
          provider
        );
        const details = await contract.eventDetails();
        setEventDetails(details);
      }
    };

    fetchEventDetails();
  }, [provider]);

  return (
    <div>
      <h2>Event Details</h2>
      {eventDetails ? (
        <div>
          <p>
            <strong>Name:</strong> {eventDetails.name}
          </p>
          <p>
            <strong>Description:</strong> {eventDetails.description}
          </p>
          <p>
            <strong>Location:</strong> {eventDetails.location}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(eventDetails.date * 1000).toLocaleString()}
          </p>
          <p>
            <strong>IPFS Hash:</strong> {eventDetails.ipfsHash}
          </p>
        </div>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
  );
};
