import { useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { ethers } from "ethers";

// Import your contract ABI (simplified version)
import EventTicketABI from "../artifacts/contracts/EventTicket.sol/EventTicket.json";

const EventTicketAddress = "YOUR_EVENT_TICKET_CONTRACT_ADDRESS"; // Replace with your contract address

export default function MintTicket() {
  const { signer, account } = useWallet();
  const [loading, setLoading] = useState(false);

  const mintTicket = async () => {
    if (!signer) return;

    try {
      const contract = new ethers.Contract(
        EventTicketAddress,
        EventTicketABI,
        signer
      );
      setLoading(true);

      const price = await contract.price();
      const tx = await contract.mintTicket({ value: price });
      await tx.wait();

      alert("Ticket minted successfully!");
    } catch (err) {
      console.error("Error minting ticket:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Mint Event Ticket</h2>
      {account ? (
        <button onClick={mintTicket} disabled={loading}>
          {loading ? "Minting..." : "Mint Ticket"}
        </button>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  );
};