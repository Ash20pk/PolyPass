// TicketBuy.js
import React, { useState } from 'react';
import { useTicketing } from './TicketingContext';
import { useParams } from 'react-router-dom';
import TicketingABI from '../contracts/Ticketing.json';
import '../styles/TicketBuy.css'; // Import the CSS file for styling

const TicketBuy = () => {
  const { accounts, web3 } = useTicketing(); // Destructure the contract from the context
  const { contractAddress } = useParams(); // Retrieve the contract address parameter from the URL

  const handleBuyTicket = async () => {
    try {
      const ticketInstance = new web3.eth.Contract(
        TicketingABI.abi,
        contractAddress,
      );

      // Call the useTicket function from the contract instance
      await ticketInstance.methods.buyTicket().send({ from: accounts });
      // Add any additional logic here after using the ticket
      alert('Successfully Bought Ticket');
    } catch (error) {
      console.error('Error buying ticket:', error);
      alert('Error: Failed to buy ticket');
    }
  };

  return (
    <div className="ticket-buy-container">
      <h2>Buy Ticket</h2>
      <button onClick={handleBuyTicket} className="buy-button">Buy Ticket</button>
    </div>
  );
};

export default TicketBuy;