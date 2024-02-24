import React, { useState, useEffect } from 'react';
import { useTicketing } from './TicketingContext';
import '../styles/Home.css'; // Import the CSS file

const Home = () => {
  const { initWeb3, accounts, connected, contract } = useTicketing();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (connected) {
      fetchAllTickets();
    }
  }, [connected]);

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      await initWeb3();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTickets = async () => {
    setLoading(true);
    try {
      const addressesArray = await contract.methods.getAllContractAddresses().call();
      const ticketData = await Promise.all(addressesArray.map(async (address) => {
        const ticketURI = await contract.methods.contractURI(address).call();
        return { address, ticketURI };
      }));
      setTickets(ticketData);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="welcome-heading">Welcome to the Ticketing Platform!</h1>
      {!connected ? (
        <button className="button" onClick={handleConnectWallet} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <>
          <p className="connected-account">Connected Account: {accounts}</p>
          {tickets.length > 0 ? (
            <div className="ticket-cards-container">
              {tickets.map((ticket, index) => (
                <div key={index} className="ticket-card">
                  <img src={ticket.ticketURI} alt={`Ticket ${index + 1}`} className="ticket-image" />
                  <p className="contract-address">Contract Address: {ticket.address}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-tickets">No tickets found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
