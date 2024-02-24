import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTicketing } from './TicketingContext';
import TicketingABI from '../contracts/Ticketing.json';
import '../styles/TicketPage.css'; // Import the CSS file for styling

const TicketPage = () => {
  const { web3 } = useTicketing();
  const { contractAddress } = useParams(); // Retrieve the contract address parameter from the URL
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch event name using contract address
    const fetchEventName = async () => {
      try {
        setLoading(true);
        setError(null);

        const ticketInstance = new web3.eth.Contract(
          TicketingABI.abi,
          contractAddress,
        );
        const name = await ticketInstance.methods.whichEvent().call();
        setEventName(name);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching the event name.');
        console.error('Error fetching event name:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventName();
  }, [contractAddress]);

  return (
    <div className="ticket-page-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <h2>Welcome to {eventName}</h2>

          {/* Buttons with links */}
          <div className="button-container">
            <button className="action-button">
              <Link to={`/${contractAddress}/buy-ticket`} className="button-link">Buy Ticket</Link>
            </button>
            <button className="action-button">
              <Link to={`/${contractAddress}/refund-ticket`} className="button-link">Refund Ticket</Link>
            </button>
            <button className="action-button">
              <Link to={`/${contractAddress}/use-ticket`} className="button-link">Use Ticket</Link>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketPage;
