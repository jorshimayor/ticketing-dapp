"use client";

import { useState } from "react";
import { useWallet } from "../../components/WalletProvider";
import { ethers } from "ethers";

const EVENT_POAP_ADDRESS = "0xc1B502126935c6eBaa78Ad915e86f487e1D2f356";
const EVENT_POAP_ABI = ["function redeemPOAP(uint256 ticketTokenId) external"];

export default function RedeemPage() {
  const { account, connectWallet, signer } = useWallet();
  const [ticketId, setTicketId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    if (!signer || !ticketId) return;
    try {
      setLoading(true);
      const contract = new ethers.Contract(
        EVENT_POAP_ADDRESS,
        EVENT_POAP_ABI,
        signer
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
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
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
