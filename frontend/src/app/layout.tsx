import type { Metadata } from "next";
import { Aleo, Yrsa } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";

const aleo = Aleo({
  variable: "--font-aleo",
  subsets: ["latin"],
});

const yrsa = Yrsa({
  variable: "--font-yrsa",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple Ticketing Dapp",
  description: "Simple Ticketing Dapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${aleo.variable} ${yrsa.variable} antialiased`}
      >
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
