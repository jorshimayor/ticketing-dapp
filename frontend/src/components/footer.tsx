const Footer = () => {
  return (
    <footer className="bg-white shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500">
        &copy; {new Date().getFullYear()} NFT Ticketing dApp. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
