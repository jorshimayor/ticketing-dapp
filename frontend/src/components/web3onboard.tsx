"use client";
import { init } from "@web3-onboard/react";
import type { Chain } from "@web3-onboard/common";
import injectedModule from "@web3-onboard/injected-wallets";

const injected = injectedModule();

const chains = [
  {
    id: "0x3e9",
    token: "KAIA",
    namespace: "evm",
    label: "Kairos Testnet",
    rpcUrl: process.env.KAIROS_TESTNET_URL,
  },
  {
    id: "0xaa36a7",
    token: "ETH",
    namespace: "evm",
    label: "Ethereum Sepolia",
    rpcUrl: process.env.ETH_TESTNET_RPC_URL,
  },
];

export const web3Onboard = init({
  wallets: [injected],
  chains: chains as Chain[],
  appMetadata: {
    name: "My Ticketing dApp",
    icon: "https://www.pngall.com/wp-content/uploads/12/Movie-Ticket-PNG-HD-Image.png",
    logo: "https://www.pngall.com/wp-content/uploads/12/Movie-Ticket-PNG-HD-Image.png",
    description: "NFT Ticket + POAP redemption",
    recommendedInjectedWallets: [
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
});
