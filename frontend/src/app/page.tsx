import MintTicket from '@/components/MintTicket';
import RedeemPOAP from '@/components/RedeemPOAP';
import EventDetails from '@/components/EventDetails';
import { WalletProvider } from '@/contexts/WalletContext';

export default function Home() {
  return (
    <WalletProvider>
      <div>
        <h1>Welcome to the Event</h1>
        <EventDetails />
        <MintTicket />
        <RedeemPOAP />
      </div>
    </WalletProvider>
  );
};