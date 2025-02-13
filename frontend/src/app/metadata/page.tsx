"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useConnectWallet } from "@web3-onboard/react";
import { eventMetadataABI, EVENT_METADATA_ADDRESS } from "@/constants";

export default function MetadataPage() {
  const [{ wallet }] = useConnectWallet();
  const [eventDetails, setEventDetails] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    ipfsHash: "",
  });

  const [newDetails, setNewDetails] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    ipfsHash: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!wallet) return;

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const provider = new ethers.BrowserProvider(wallet.provider);
        const contract = new ethers.Contract(
          EVENT_METADATA_ADDRESS,
          eventMetadataABI,
          provider
        );
        const details = await contract.eventDetails();

        setEventDetails({
          name: details.name,
          description: details.description,
          location: details.location,
          date: new Date(details.date.toNumber() * 1000).toLocaleString(),
          ipfsHash: details.ipfsHash,
        });

        setNewDetails({
          name: details.name,
          description: details.description,
          location: details.location,
          date: details.date.toNumber(),
          ipfsHash: details.ipfsHash,
        });
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(
          "Failed to load event details. Are you connected as the owner?"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [wallet]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewDetails({
      ...newDetails,
      [e.target.name]: e.target.value,
    });
  };

  const updateEventDetails = async () => {
    if (!wallet) {
      alert("Please connect your wallet first.");
      return;
    }

    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const provider = new ethers.BrowserProvider(wallet.provider);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        EVENT_METADATA_ADDRESS,
        eventMetadataABI,
        signer
      );

      const tx = await contract.setEventDetails(
        newDetails.name,
        newDetails.description,
        newDetails.location,
        newDetails.date,
        newDetails.ipfsHash
      );
      await tx.wait();

      setSuccess("Event details updated successfully!");
      setLoading(true);

      const updatedDetails = await contract.eventDetails();
      setEventDetails({
        name: updatedDetails.name,
        description: updatedDetails.description,
        location: updatedDetails.location,
        date: new Date(updatedDetails.date.toNumber() * 1000).toLocaleString(),
        ipfsHash: updatedDetails.ipfsHash,
      });

      setNewDetails({
        name: updatedDetails.name,
        description: updatedDetails.description,
        location: updatedDetails.location,
        date: updatedDetails.date.toNumber(),
        ipfsHash: updatedDetails.ipfsHash,
      });
    } catch (err: unknown) {
      console.error("Error updating event details:", err);
      setError("Failed to update event details. Are you the owner?");
    } finally {
      setUpdating(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Manage Event Details
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <svg
                  className="animate-spin h-10 w-10 text-purple-600"
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
            ) : (
              <>
                {error && (
                  <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
                    {success}
                  </div>
                )}

                <section className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Current Event Details
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {eventDetails.name}
                    </p>
                    <p>
                      <strong>Description:</strong> {eventDetails.description}
                    </p>
                    <p>
                      <strong>Location:</strong> {eventDetails.location}
                    </p>
                    <p>
                      <strong>Date:</strong> {eventDetails.date}
                    </p>
                    <p>
                      <strong>IPFS Hash:</strong> {eventDetails.ipfsHash}
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-4">
                    Update Event Details
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newDetails.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Enter event name"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={newDetails.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Enter event description"
                        rows={4}
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-gray-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={newDetails.location}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Enter event location"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">
                        Date (Unix Timestamp)
                      </label>
                      <input
                        type="number"
                        name="date"
                        value={newDetails.date}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Enter event date (Unix timestamp)"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">IPFS Hash</label>
                      <input
                        type="text"
                        name="ipfsHash"
                        value={newDetails.ipfsHash}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Enter IPFS hash"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={updateEventDetails}
                      disabled={updating}
                      className={`w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition duration-200 ${
                        updating ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {updating ? "Updating..." : "Update Event Details"}
                    </button>
                  </form>
                </section>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
