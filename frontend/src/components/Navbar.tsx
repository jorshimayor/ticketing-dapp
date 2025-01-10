"use client";

import Link from "next/link";
import { useConnectWallet } from "@web3-onboard/react";

const Navbar = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div>
        <Link href="/">
          <p className="text-2xl font-bold text-blue-600">NFT Ticketing dApp</p>
        </Link>
      </div>

      <div className="space-x-10 hidden md:flex">
        <Link href="/mint">
          <p className="text-gray-200 hover:text-blue-600">Mint Ticket</p>
        </Link>
        <Link href="/my-tickets">
          <p className="text-gray-200 hover:text-blue-600">My Tickets</p>
        </Link>
        <Link href="/admin">
          <p className="text-gray-200 hover:text-blue-600">Admin</p>
        </Link>
        <Link href="/metadata">
          <p className="text-gray-200 hover:text-blue-600">Metadata</p>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="bg-white text-blue-600 py-2 px-6 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
          disabled={connecting}
          onClick={() => (wallet ? disconnect(wallet) : connect())}
        >
          {connecting ? "Connecting" : wallet ? "Disconnect" : "Connect"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
