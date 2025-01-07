"use client";

import { useState } from "react";
import { useWallet } from "../../components/WalletProvider";
import { ethers } from "ethers";

// Example: Replace with your deployed EventTicket address & ABI
const EVENT_TICKET_ADDRESS = "0xEventTicketContractAddress";
const EVENT_TICKET_ABI = [
  // Minimal ABI snippet
  "function mintTicket() payable",
  "function price() view returns (uint256)",
  "function saleActive() view returns (bool)",
];

export default function MintPage() {
  const { account, connectWallet, signer } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    if (!signer) return alert("No signer found. Connect wallet first.");
    try {
      setLoading(true);
      const contract = new ethers.Contract(
        EVENT_TICKET_ADDRESS,
        EVENT_TICKET_ABI,
        signer
      );
      const ticketPrice = await contract.price();
      const tx = await contract.mintTicket({ value: ticketPrice });
      await tx.wait();
      alert("Ticket minted successfully!");
    } catch (err) {
      console.error("Error minting ticket:", err);
      alert("Minting failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Mint Your Ticket</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <button onClick={handleMint} disabled={loading}>
          {loading ? "Minting..." : "Mint Ticket"}
        </button>
      )}
    </div>
  );
}
