import Link from "next/link";

export default function Home() {
  return (
    <body className="h-screen md:h-full">
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Welcome to the Ticketing DApp</h1>
          <p className="mt-2 text-lg">
            Secure your spot and mint your NFT ticket!
          </p>
        </div>
      </header>

      <main className="container mx-auto my-10">
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-1/4 p-4">
              <Link href="https://lu.ma" target="_blank">
                <div className="flex flex-col items-center justify-center h-full bg-white shadow-lg rounded-lg p-6">
                  <h3 className="text-xl font-semibold">1. Register</h3>
                  <p>Follow the link to sign up for an event on Luma then mint your NFT ticket here.</p>
                </div>
              </Link>
            </div>
            <div className="w-full md:w-1/4 p-4">
              <Link href="/mint" className="">
                <div className="flex flex-col items-center justify-center h-full bg-white shadow-lg rounded-lg p-6">
                  <h3 className="text-xl font-semibold">2. Mint NFT</h3>
                  <p>Mint your NFT ticket once you register.</p>
                </div>
              </Link>
            </div>
            <div className="w-full md:w-1/4 p-4">
              <Link href="/redeem" className="">
                <div className="flex flex-col items-center justify-center h-full bg-white shadow-lg rounded-lg p-6">
                  <h3 className="text-xl font-semibold">3. Get POAP</h3>
                  <p>
                    Exchange your NFT on-site for a POAP NFT to prove
                    attendance.
                  </p>
                </div>
              </Link>
            </div>
            <div className="w-full md:w-1/4 p-4">
              <Link href="/mint" className="">
                <div className="flex flex-col items-center justify-center h-full bg-white shadow-lg rounded-lg p-6">
                  <h3 className="text-xl font-semibold">4. Update Metadata</h3>
                  <p>Update the metadata for your event.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="text-center mt-10">
          <h2 className="text-3xl font-semibold mb-6">Ready to Get Started?</h2>
          <Link
            href="https://lu.ma"
            target="_blank"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
          >
            Sign Up Now
          </Link>
        </section>
      </main>
    </body>
  );
}
