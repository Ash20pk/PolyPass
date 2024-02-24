import React, { useState, useEffect } from 'react';
import { useTicketing } from './TicketingContext';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import Button from '@mui/material/Button';


const Home = () => {
  const { connected, contract } = useTicketing();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (connected) {
      fetchAllTickets();
    }
  }, [connected]);


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
      <h1 className="welcome-heading">Welcome to PolyPass!</h1>
        <>
          <div>
            {tickets.length > 0 ? (
              <div className="ticket-cards-container">
                {tickets.map((ticket, index) => (
                  <div className="ticket-card" key={index}>
                    <Link to={`/${ticket.address}`} className="ticket-link">
                      <img 
                        src={`https://gateway.pinata.cloud/ipfs/${ticket.ticketURI.slice(7)}`} 
                        alt={`Ticket ${index + 1}`} 
                        className="ticket-image" 
                      />
                      <Button variant="contained" className='button'>view details</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-tickets">Loading...</p>
            )}
          </div>
        </>
    
    </div>
  );
};

export default Home;
