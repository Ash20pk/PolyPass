import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTicketing } from './TicketingContext';
import TicketingABI from '../contracts/Ticketing.json';
import '../styles/TicketPage.css'; // Import the CSS file for styling
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

const TicketPage = () => {
  const { web3js, accounts } = useTicketing();
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
        console.log(contractAddress);
        const ticketInstance = new web3js.eth.Contract(
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
  }, [accounts]);

  return (
    <div className="ticket-page-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <h2>Welcome to {eventName}</h2>

          <Stack direction="column" spacing={2} justifyContent="center" alignItems="center">
            <Button variant='contained' className="action-button">
              <Link to={`/${contractAddress}/buy-ticket`} className="button-link">Buy Ticket</Link>
            </Button>
            <Button variant='contained' className="action-button">
              <Link to={`/${contractAddress}/refund-ticket`} className="button-link">Refund Ticket</Link>
            </Button>
            <Button variant='contained' className="action-button">
              <Link to={`/${contractAddress}/use-ticket`} className="button-link">Use Ticket</Link>
            </Button>
            </Stack>
        </>
      )}
    </div>
  );
};

export default TicketPage;
