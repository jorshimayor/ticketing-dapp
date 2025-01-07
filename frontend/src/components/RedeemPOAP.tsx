import { useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { ethers } from "ethers";

// Import your contract ABI (simplified version)
import EventPOAPABI from "../artifacts/contracts/EventPOAP.sol/EventPOAP.json";

const EventPOAPAddress = "YOUR_EVENT_POAP_CONTRACT_ADDRESS"; // Replace with your contract address

export default function RedeemPOAP() {
  const { signer, account } = useWallet();
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const redeemPOAP = async () => {
    if (!signer || ticketId === null) return;

    try {
      const contract = new ethers.Contract(
        EventPOAPAddress,
        EventPOAPABI,
        signer
      );
      setLoading(true);

      const tx = await contract.redeemPOAP(ticketId);
      await tx.wait();

      alert("POAP redeemed successfully!");
    } catch (err) {
      console.error("Error redeeming POAP:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Redeem POAP</h2>
      {account ? (
        <div>
          <input
            type="number"
            placeholder="Enter your ticket ID"
            onChange={(e) => setTicketId(Number(e.target.value))}
          />
          <button onClick={redeemPOAP} disabled={loading}>
            {loading ? "Redeeming..." : "Redeem POAP"}
          </button>
        </div>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  );
};
