// TicketRefund.js
import React, { useState } from 'react';
import { useTicketing } from './TicketingContext';
import { useParams } from 'react-router-dom';
import TicketingABI from '../contracts/Ticketing.json';
import '../styles/TicketRefund.css'; // Import the CSS file for styling

const TicketRefund = () => {
  const { accounts, web3js } = useTicketing(); // Destructure the contract from the context
  const { contractAddress } = useParams(); // Retrieve the contract address parameter from the URL
  const [ticketId, setTicketId] = useState(''); // Retrieve the set ticket identifier

  const handleRefundTicket = async () => {
    try {
      const ticketInstance = new web3js.eth.Contract(
        TicketingABI.abi,
        contractAddress,
      );

      // Call the refundTicket function from the contract instance
      await ticketInstance.methods.refundTicket(ticketId).send({ from: accounts });
      // Add any additional logic here after using the ticket
      alert('Ticket Refunded Successfully');
    } catch (error) {
      console.error('Error refunding ticket:', error);
      alert('Error: Failed to refund ticket');
    }
  };

  return (
    <div className="ticket-refund-container">
      <h2>Refund Ticket</h2>
      <input
        type="number"
        placeholder="Ticket ID"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        className="ticket-id-input"
      />
      <button onClick={handleRefundTicket} className="refund-button">Refund Ticket</button>
    </div>
  );
};

export default TicketRefund;
