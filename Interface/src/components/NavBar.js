// NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTicketing } from './TicketingContext'; 
import '../styles/NavBar.css';
import Button from '@mui/material/Button';


const NavBar = () => {
  const { initWeb3, connected, disconnect} = useTicketing();
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

  console.log(connected);

  return (
    <div className="navbar">
      <div className="nav-links">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/create-ticket" className="nav-link">Create Ticket</Link>
    </div>
    <h1 className="logo">PolyPass</h1>
    {!connected ? (
      <Button variant='contained'  onClick={handleConnectWallet} >
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    ) : (
      <Button variant='contained' color="success" onClick={disconnect} >
        Wallet Connected
      </Button>
    )}
  </div>
  );
};

export default NavBar;
