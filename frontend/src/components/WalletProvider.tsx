"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

interface WalletContextProps {
  account: string | null;
  connectWallet: () => Promise<void>;
  signer: ethers.Signer | null;
}

const WalletContext = createContext<WalletContextProps>({
  account: null,
  connectWallet: async () => {},
  signer: null,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);
    setSigner(signer);
  };

  return (
    <WalletContext.Provider value={{ account, connectWallet, signer }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
