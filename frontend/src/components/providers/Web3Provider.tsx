'use client';

import { Web3OnboardProvider } from "@web3-onboard/react";
import { web3Onboard } from "@/lib/web3onboard";

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      {children}
    </Web3OnboardProvider>
  );
} 