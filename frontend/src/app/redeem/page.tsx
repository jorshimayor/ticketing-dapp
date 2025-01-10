"use client";

import { useState } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from "ethers";
import { EVENT_POAP_ADDRESS, eventPOAPABI } from "@/constants";

export default function RedeemPage() {
  const [wallet, connectWallet, signer] = useConnectWallet();
  const [ticketId, setTicketId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    if (!wallet?.wallet?.provider) return;
    try {
      setLoading(true);
      const contract = new ethers.Contract(
        EVENT_POAP_ADDRESS,
        eventPOAPABI,
        await new ethers.BrowserProvider(wallet.wallet.provider).getSigner()
      );
      const tx = await contract.redeemPOAP(ticketId);
      await tx.wait();
      alert("POAP redeemed successfully!");
    } catch (err) {
      console.error("Error redeeming POAP:", err);
      alert("Redemption failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Redeem Your POAP</h1>
      {!wallet ? (
        <button onClick={() => connectWallet()}>Connect Wallet</button>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Ticket ID"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
          />
          <button onClick={handleRedeem} disabled={loading}>
            {loading ? "Redeeming..." : "Redeem POAP"}
          </button>
        </div>
      )}
    </div>
  );
}
