"use client";

import { useWallet } from "./WalletProvider";

const Navbar = () => {
  const { connectWallet } = useWallet();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-xl font-bold">Event Ticketing</div>
      <div className="flex items-center gap-4">
        <button
          className="bg-white text-blue-600 py-2 px-6 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
