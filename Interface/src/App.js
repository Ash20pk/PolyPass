import React from 'react';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import Home from './components/Home';
import TicketCreation from './components/TicketCreation';
import NavBar from './components/NavBar';
import TicketPage from './components/TicketPage';
import TicketBuy from './components/TicketBuy';
import TicketRefund from './components/TicketRefund';
import TicketUsage from './components/TicketUsage';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-ticket" element={<TicketCreation />} />
        <Route path="/:contractAddress" element={<TicketPage />} />
        <Route path="/:contractAddress/buy-ticket" element={<TicketBuy />} />
        <Route path="/:contractAddress/refund-ticket" element={<TicketRefund />} />
        <Route path="/:contractAddress/use-ticket" element={<TicketUsage />} />

      </Routes>
    </Router>
  );
};

export default App;
