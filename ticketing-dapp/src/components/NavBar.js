// NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTicketing } from './TicketingContext'; 
import '../styles/NavBar.css';


const NavBar = () => {
  const { initWeb3, accounts, connected } = useTicketing();
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="navbar">
    <h1 className="logo">Ticket</h1>
    {!connected ? (
      <button className="connect-button" onClick={handleConnectWallet} disabled={loading}>
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>
    ) : (
      <p className="connected-account">Connected Account: {accounts}</p>
    )}

    <div className="nav-links">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/create-ticket" className="nav-link">Create Ticket</Link>
    </div>
  </div>
  );
};

export default NavBar;
