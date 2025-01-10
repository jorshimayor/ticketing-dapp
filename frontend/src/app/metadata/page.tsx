"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import type { EIP1193Provider } from '@web3-onboard/core';

import { eventMetadataABI, EVENT_METADATA_ADDRESS } from "@/constants";
import { useConnectWallet } from "@web3-onboard/react";

export default function MetadataPage() {
  const [wallet, connectWallet, signer] = useConnectWallet();
  
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState<number>(0);
  const [ipfsHash, setIpfsHash] = useState("");

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDate, setNewDate] = useState<number>(0);
  const [newIpfsHash, setNewIpfsHash] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!signer) return;

      try {
        if (!wallet?.wallet?.provider) return;
        
        const contract = new ethers.Contract(
          EVENT_METADATA_ADDRESS,
          eventMetadataABI,
          await new ethers.BrowserProvider((wallet?.wallet?.provider as EIP1193Provider)).getSigner()
        );

        const details = await contract.eventDetails();

        setEventName(details.name);
        setEventDescription(details.description);
        setEventLocation(details.location);
        setEventDate(details.date.toNumber());
        setIpfsHash(details.ipfsHash);
      } catch (err) {
        console.error("Error reading event details:", err);
      }
    };

    fetchDetails();
  }, [signer]);

  const handleSetEventDetails = async () => {
    if (!signer) {
      alert("Connect your wallet first.");
      return;
    }
    setLoading(true);

    try {
      const contract = new ethers.Contract(
        EVENT_METADATA_ADDRESS,
        eventMetadataABI,
        await new ethers.BrowserProvider((wallet?.wallet?.provider as EIP1193Provider)).getSigner()
      );

      const tx = await contract.setEventDetails(
        newName,
        newDescription,
        newLocation,
        newDate,
        newIpfsHash
      );
      await tx.wait();

      alert("Event details updated!");

      setEventName(newName);
      setEventDescription(newDescription);
      setEventLocation(newLocation);
      setEventDate(newDate);
      setIpfsHash(newIpfsHash);
    } catch (err) {
      console.error("Error setting event details:", err);
      alert("Failed to set event details. Are you the owner?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Event Metadata</h1>
      {!wallet ? (
        <button onClick={() => connectWallet()}>Connect Wallet</button>
      ) : (
        <>
          <section style={{ margin: "1rem 0" }}>
            <h2>Current Event Details</h2>
            <p>
          <strong>Name:</strong> {eventName}
        </p>
        <p>
          <strong>Description:</strong> {eventDescription}
        </p>
        <p>
          <strong>Location:</strong> {eventLocation}
        </p>
        <p>
          <strong>Date (Unix):</strong> {eventDate}
        </p>
        <p>
          <strong>IPFS Hash:</strong> {ipfsHash}
        </p>
      </section>

      <section style={{ margin: "1rem 0" }}>
        <h2>Set New Event Details (Owner Only)</h2>
        <div
          style={{ display: "flex", flexDirection: "column", maxWidth: 400 }}
        >
          <input
            type="text"
            placeholder="Event name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Event description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Event location"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <input
            type="number"
            placeholder="Event date (Unix timestamp)"
            value={newDate}
            onChange={(e) => setNewDate(Number(e.target.value))}
          />
          <input
            type="text"
            placeholder="IPFS Hash"
            value={newIpfsHash}
            onChange={(e) => setNewIpfsHash(e.target.value)}
          />

          <button onClick={handleSetEventDetails} disabled={loading}>
            {loading ? "Updating..." : "Update Event Details"}
          </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
