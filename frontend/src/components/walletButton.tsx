"use client";

import React from "react";
import { useConnectWallet } from "@web3-onboard/react";

export default function WalletButton() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  let address: string | undefined;

  if (wallet) {
    if (wallet.accounts?.length > 0) {
      address = wallet.accounts[0].address;
    }
  }

  return (
    <div>
      <button
        onClick={() => (wallet ? disconnect(wallet) : connect())}
        disabled={connecting}
      >
        {connecting
          ? "Connecting..."
          : wallet
          ? "Disconnect"
          : "Connect Wallet"}
      </button>
      {wallet && address && <p>Connected: {address}</p>}
    </div>
  );
}
