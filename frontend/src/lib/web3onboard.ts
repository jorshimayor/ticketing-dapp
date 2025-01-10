import { init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";

const injected = injectedModule();

const chains = [
  {
    id: 1001,
    token: 'KAIOS',
    label: 'Kaios Testnet',
    rpcUrl: 'https://public-en-kairos.node.kaia.io'
  }
];

export const web3Onboard = init({
  wallets: [injected],
  chains,
  appMetadata: {
    name: "My Ticketing dApp",
    icon: "<your-icon-string>",
    description: "A simple ticketing dApp"
  }
}); 