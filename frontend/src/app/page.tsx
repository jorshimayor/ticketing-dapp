import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Welcome to the Event!</h1>
      <p>
        Register for the event on Luma (we’d send you a link or embed a link
        below). After registering, head to <Link href="/mint">/mint</Link> to
        get your NFT ticket. Then on-site, head to{" "}
        <Link href="/redeem">/redeem</Link> to swap your ticket for a POAP.
      </p>
    </main>
  );
}
