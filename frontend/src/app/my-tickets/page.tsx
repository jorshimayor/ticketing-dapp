"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { ethers } from "ethers";

import { useConnectWallet } from "@web3-onboard/react";
import WalletButton from "../../components/walletButton";

import { EVENT_TICKET_ADDRESS, eventTicketABI } from "@/constants";

interface Ticket {
  tokenId: number;
  metadata: {
    image?: string;
    name?: string;
    description?: string;
  } | null;
}

export default function MyTicketsPage() {
  const [{ wallet }] = useConnectWallet();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTickets = async () => {
      if (!wallet) return;

      setLoading(true);
      setError("");
      setTickets([]);

      try {
        const ethersProvider = new ethers.BrowserProvider(
          wallet.provider,
          "any"
        );
        const signer = await ethersProvider.getSigner();
        const contract = new ethers.Contract(
          EVENT_TICKET_ADDRESS,
          eventTicketABI,
          signer
        );

        const balance = await contract.balanceOf(wallet.accounts[0].address);
        const ticketIds: number[] = [];

        for (let i = 0; i < balance.toNumber(); i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(
            wallet.accounts[0].address,
            i
          );
          ticketIds.push(tokenId.toNumber());
        }

        const fetchedTickets: Ticket[] = [];

        for (const id of ticketIds) {
          try {
            const tokenURI = await contract.tokenURI(id);
            const response = await fetch(tokenURI);
            const metadata = await response.json();
            fetchedTickets.push({ tokenId: id, metadata });
          } catch (metadataError) {
            console.error(
              `Error fetching metadata for token ID ${id}:`,
              metadataError
            );
            fetchedTickets.push({ tokenId: id, metadata: null });
          }
        }

        setTickets(fetchedTickets);
      } catch (fetchError: unknown) {
        console.error("Error fetching tickets: ", fetchError);
        setError("Failed to fetch your tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [wallet]);

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-center">My Tickets</h1>

        {!wallet && (
          <div className="bg-green-700 text-gray-200 p-4 rounded mb-6">
            <p className="mb-10 text-center mx-auto">
              You need to connect your wallet to view your tickets.
            </p>
            <div className="flex justify-center items-center bg-gray-700 rounded-md p-2 w-40 mx-auto cursor-pointer hover:bg-blue-500 transition duration-200">
              <WalletButton />
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && !error && tickets.length === 0 && wallet && (
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded">
            You have not minted any tickets yet.
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.tokenId}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                {ticket.metadata && ticket.metadata.image ? (
                  <Image
                    alt={`Ticket ${ticket.tokenId}`}
                    src={ticket.metadata.image}
                    className="w-full h-48 object-cover"
                    height={192}
                    width={384}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    Ticket #{ticket.tokenId}
                  </h2>
                  {ticket.metadata && ticket.metadata.name && (
                    <p className="text-gray-700 mb-2">{ticket.metadata.name}</p>
                  )}
                  {ticket.metadata && ticket.metadata.description && (
                    <p className="text-gray-600 mb-4">
                      {ticket.metadata.description}
                    </p>
                  )}
                  <Link
                    href={`/redeem?ticketId=${ticket.tokenId}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Redeem POAP
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
