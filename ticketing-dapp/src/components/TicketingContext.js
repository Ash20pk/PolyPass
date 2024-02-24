// TicketingContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import TicketingContractABI from '../contracts/TicketingFactory.json';

const TicketingContext = createContext();

export const TicketingProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);

  const TicketingFactoryAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  const initWeb3 = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts[0]);
        console.log(accounts[0]);
        const contractInstance = new web3Instance.eth.Contract(
          TicketingContractABI.abi,
          TicketingFactoryAddress,
        );
        setContract(contractInstance);
        setConnected(true);
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    } catch (error) {
      console.error('Error initializing web3:', error);
    }
  };

  useEffect(() => {
    initWeb3();
  }, []);

  return (
    <TicketingContext.Provider value={{ web3, accounts, contract, connected, initWeb3 }}>
      {children}
    </TicketingContext.Provider>
  );
};

export const useTicketing = () => useContext(TicketingContext);