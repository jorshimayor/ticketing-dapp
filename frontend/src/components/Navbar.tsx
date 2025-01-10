"use client";

import { useConnectWallet } from "@web3-onboard/react";

const Navbar = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-xl font-bold">Event Ticketing</div>
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
