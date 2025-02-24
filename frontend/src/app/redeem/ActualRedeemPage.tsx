"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ethers } from "ethers";
import { useConnectWallet } from "@web3-onboard/react";
import { EVENT_POAP_ADDRESS, eventPOAPABI } from "@/constants";

export default function ActualRedeemPage() {
  const [{ wallet }] = useConnectWallet();
  const searchParams = useSearchParams();
  const ticketIdParam = searchParams.get("ticketId");
  const ticketId = ticketIdParam ? Number(ticketIdParam) : null;
  const [loading, setLoading] = useState<boolean>(false);
  const [redeemError, setRedeemError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const redeemPOAP = async () => {
    if (!wallet) {
      setRedeemError("Please connect your wallet.");
      return;
    }
    if (!ticketId) {
      setRedeemError("Invalid ticket ID.");
      return;
    }
    setLoading(true);
    setRedeemError("");
    setSuccessMessage("");
    try {
      const provider = new ethers.BrowserProvider(wallet.provider, "any");
      const signer = await provider.getSigner();
      const poapContract = new ethers.Contract(
        EVENT_POAP_ADDRESS,
        eventPOAPABI,
        signer
      );

      // Redeem POAP by calling the contract function with the ticketTokenId
      const tx = await poapContract.redeemPOAP(ticketId);
      await tx.wait();

      setSuccessMessage("POAP redeemed successfully!");
    } catch (error: unknown) {
      console.error("Error redeeming POAP:", error);
      setRedeemError(
        (error as { reason?: string })?.reason || "Failed to redeem POAP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Redeem Your POAP</h1>
        {ticketId ? (
          <p className="text-gray-700 mb-4 text-center">
            Redeeming for ticket ID:{" "}
            <span className="font-semibold">{ticketId}</span>
          </p>
        ) : (
          <p className="text-red-500 mb-4 text-center">Invalid ticket ID.</p>
        )}

        {redeemError && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {redeemError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}

        <button
          onClick={redeemPOAP}
          disabled={loading || !ticketId}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          {loading ? "Redeeming..." : "Redeem POAP"}
        </button>
      </div>
    </div>
  );
}
