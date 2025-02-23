"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ethers, formatEther } from "ethers";
import { useConnectWallet } from "@web3-onboard/react";
import { EVENT_TICKET_ADDRESS, eventTicketABI } from "@/constants";

export default function MintPage() {
  const [{ wallet }] = useConnectWallet();
  const [email, setEmail] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [ticketPrice, setTicketPrice] = useState<string>("0.0");
  const [txHash, setTxHash] = useState<string>("");
  const [mintingError, setMintingError] = useState<string>("");
  const [ownerAddress, setOwnerAddress] = useState<string>("");

  // Fetch ticket price when wallet is connected
  useEffect(() => {
    const fetchPrice = async () => {
      if (wallet) {
        try {
          const ethersProvider = new ethers.BrowserProvider(
            wallet.provider,
            "any"
          );
          const contract = new ethers.Contract(
            EVENT_TICKET_ADDRESS,
            eventTicketABI,
            ethersProvider
          );

          const price = await contract.price(); // Fetch price
          setTicketPrice(formatEther(price)); // Format and set price in KAIA
        } catch (error) {
          console.error("Error fetching ticket price: ", error);
          setMintingError("Failed to fetch ticket price. Please try again.");
        }
      }
    };
    fetchPrice();
  }, [wallet]);

  // Fetch owner address when wallet is connected
  useEffect(() => {
    const fetchOwner = async () => {
      if (wallet) {
        try {
          const ethersProvider = new ethers.BrowserProvider(
            wallet.provider,
            "any"
          );
          const contract = new ethers.Contract(
            EVENT_TICKET_ADDRESS,
            eventTicketABI,
            ethersProvider
          );

          const owner = await contract.owner();
          setOwnerAddress(owner.toLowerCase());
        } catch (error) {
          console.error("Error fetching owner address: ", error);
        }
      }
    };
    fetchOwner();
  }, [wallet]);

  // Verify attendee status
  const verifyAttendee = async () => {
    if (!email) {
      setVerificationError("Please enter your email.");
      return;
    }

    setLoading(true);
    setVerificationError("");
    setIsVerified(false);

    try {
      console.log("Verifying attendee for email:", email);
      const response = await fetch("/api/verify-attendee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      console.log("Verification result:", result);

      if (response.ok && result.success) {
        setIsVerified(true);
      } else {
        setVerificationError(
          result.error || "Verification failed. Please check your email."
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationError("An unexpected error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  // Mint NFT ticket
  const mintTicket = async () => {
    if (!wallet) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!isVerified) {
      alert("Please verify your attendee status before minting.");
      return;
    }

    setLoading(true);
    setTxHash("");
    setMintingError("");

    try {
      const ethersProvider = new ethers.BrowserProvider(wallet.provider, "any");
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        EVENT_TICKET_ADDRESS,
        eventTicketABI,
        signer
      );

      // Fetch ticket price
      const price = await contract.price();

      // Send transaction with gas estimate
      const tx = await contract.mintTicket({
        value: price,
      });

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setTxHash(receipt.transactionHash);
        alert("Ticket minted successfully!");

        // Call the API to update attendee status to "minted"
        await fetch("/api/update-attendee-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        setIsVerified(true);
      } else {
        setMintingError("Transaction failed. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Minting error:", error);
      if ((error as { code?: number }).code === 4001) {
        setMintingError("Transaction rejected by user.");
      } else {
        setMintingError(
          "Failed to mint ticket. Please check your wallet balance and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle sale function (owner-only)
  const toggleSale = async () => {
    if (!wallet) {
      alert("Please connect your wallet first.");
      return;
    }
    setLoading(true);
    try {
      const ethersProvider = new ethers.BrowserProvider(wallet.provider, "any");
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        EVENT_TICKET_ADDRESS,
        eventTicketABI,
        signer
      );

      const tx = await contract.toggleSale();
      await tx.wait();
      alert("Sale toggled successfully!");
    } catch (error) {
      console.error("Error toggling sale:", error);
      alert("Failed to toggle sale. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Determine if connected wallet is the owner
  const isOwner =
    wallet && wallet.accounts?.[0].address.toLowerCase() === ownerAddress;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <h1 className="text-2xl my-5 font-bold text-blue-600 text-center">
        Mint Your NFT Ticket
      </h1>

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Secure Your Spot
            </h2>

            {/* Owner-only Sale Toggle Section */}
            {isOwner && (
              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Owner Controls</h3>
                <button
                  onClick={toggleSale}
                  disabled={loading}
                  className={`w-full bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Processing..." : "Toggle Sale"}
                </button>
              </section>
            )}

            {/* Verification Section */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Verify Your Attendee Status
              </h3>
              <div className="flex flex-col sm:flex-row items-center">
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-auto flex-1 border border-gray-300 rounded-md px-4 py-2 mb-4 sm:mb-0 sm:mr-4"
                />
                <button
                  onClick={verifyAttendee}
                  disabled={loading}
                  className={`w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </div>
              {verificationError && (
                <p className="mt-2 text-red-600 text-sm">{verificationError}</p>
              )}
              {isVerified && (
                <p className="mt-2 text-green-600 text-sm">
                  Verification successful! You can now mint your ticket.
                </p>
              )}
            </section>

            {/* Minting Section */}
            <section>
              <h3 className="text-xl font-semibold mb-4">Mint Your Ticket</h3>
              <div className="mb-4">
                <p className="text-gray-700">
                  <strong>Ticket Price: </strong> {ticketPrice} KAIA
                </p>
              </div>
              <button
                onClick={mintTicket}
                disabled={loading || !isVerified}
                className={`w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-200 ${
                  loading || !isVerified ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Minting..." : "Mint Ticket"}
              </button>
              {mintingError && (
                <p className="mt-4 text-red-600 text-sm">{mintingError}</p>
              )}
              {txHash && (
                <p className="mt-4 text-blue-600 text-sm">
                  View Transaction:{" "}
                  <Link
                    href={`https://etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {txHash}
                  </Link>
                </p>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
