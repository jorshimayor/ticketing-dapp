import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-100">
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Welcome to the NFT Ticketing Experience
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Secure your spot at our exclusive event by minting your unique NFT
              ticket. Enjoy seamless redemption for POAPs upon attendance.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/mint">
                <p className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition duration-200">
                  Mint Your Ticket
                </p>
              </Link>
              <Link href="/my-tickets">
                <p className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-green-700 transition duration-200">
                  View My Tickets
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-coins mx-auto"
            >
              <circle cx="8" cy="8" r="6" />
              <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
              <path d="M7 6h1v4" />
              <path d="m16.71 13.88.7.71-2.82 2.82" />
            </svg>
            <h3 className="text-xl font-semibold my-2">Secure Minting</h3>
            <p className="text-gray-600">
              Mint your NFT tickets securely using Kaia blockchain
              technology, ensuring authenticity and ownership.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-tickets-plane mx-auto"
            >
              <path d="M10.5 17h1.227a2 2 0 0 0 1.345-.52L18 12" />
              <path d="m12 13.5 3.75.5" />
              <path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8" />
              <path d="M6 10V8" />
              <path d="M6 14v1" />
              <path d="M6 19v2" />
              <rect x="2" y="8" width="20" height="13" rx="2" />
            </svg>
            <h3 className="text-xl font-semibold my-2">POAP Redemption</h3>
            <p className="text-gray-600">
              Redeem your NFT tickets for Proof of Attendance Protocol (POAP)
              tokens, commemorating your participation.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-user-round-check mx-auto"
            >
              <path d="M2 21a8 8 0 0 1 13.292-6" />
              <circle cx="10" cy="8" r="5" />
              <path d="m16 19 2 2 4-4" />
            </svg>
            <h3 className="text-xl font-semibold my-2">Attendee Management</h3>
            <p className="text-gray-600">
              Admins can effortlessly manage attendee lists through CSV uploads
              or integrate with Google Calendar for automated syncing.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
