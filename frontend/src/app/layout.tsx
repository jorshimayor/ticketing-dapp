import type { Metadata } from "next";
import { Aleo, Yrsa } from "next/font/google";
import Web3Provider from "@/components/providers/Web3Provider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

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
      <body className={`${aleo.variable} ${yrsa.variable} antialias`}>
        <Web3Provider>
          <Navbar />
          {children}
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
