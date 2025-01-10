"use client";

import { useState } from "react";
import { ethers } from "ethers";

import { EVENT_TICKET_ADDRESS, eventTicketABI } from "@/constants";
import { useConnectWallet } from "@web3-onboard/react";

export default function MintPage() {
  const [wallet, connectWallet, signer] = useConnectWallet();
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    if (!signer) return alert("No signer found. Connect wallet first.");
    try {
      setLoading(true);
      if (!wallet?.wallet?.provider) return;
      const provider = new ethers.BrowserProvider(wallet.wallet.provider);

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        EVENT_TICKET_ADDRESS,
        eventTicketABI,
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
      {!wallet ? (
        <button onClick={() => connectWallet()}>Connect Wallet</button>
      ) : (
        <button onClick={handleMint} disabled={loading}>
          {loading ? "Minting..." : "Mint Ticket"}
        </button>
      )}
    </div>
  );
}
