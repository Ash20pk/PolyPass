// TicketUsage.js
import React, { useState } from 'react';
import { useTicketing } from './TicketingContext';
import { useParams } from 'react-router-dom';
import TicketingABI from '../contracts/Ticketing.json';
import '../styles/TicketUsage.css'; // Import the CSS file for styling

const TicketUsage = () => {
  const { accounts, web3 } = useTicketing(); // Destructure the contract from the context
  const { contractAddress } = useParams(); // Retrieve the contract address parameter from the URL
  const [ticketId, setTicketId] = useState(''); // Retrieve the set ticket identifier

  const handleUseTicket = async () => {
    try {
      const ticketInstance = new web3.eth.Contract(
        TicketingABI.abi,
        contractAddress,
      );

      // Call the useTicket function from the contract instance
      await ticketInstance.methods.useTicket(ticketId).send({ from: accounts });
      // Add any additional logic here after using the ticket
      alert('Ticket Used Successfully');
    } catch (error) {
      console.error('Error using ticket:', error);
      alert('Error: Failed to use ticket');
    }
  };

  return (
    <div className="ticket-usage-container">
      <h2>Use Ticket</h2>
      <input
        type="number"
        placeholder="Ticket ID"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        className="ticket-id-input"
      />
      <button onClick={handleUseTicket} className="use-button">Use Ticket</button>
    </div>
  );
};

export default TicketUsage;
