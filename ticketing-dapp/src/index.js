import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { TicketingProvider } from '../src/components/TicketingContext'; 

ReactDOM.render(
  <React.StrictMode>
    <TicketingProvider> {/* Wrap your App component with TicketingProvider */}
      <App />
    </TicketingProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
