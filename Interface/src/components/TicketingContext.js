// TicketingContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import TicketingContractABI from '../contracts/TicketingFactory.json';

const TicketingContext = createContext();

export const TicketingProvider = ({ children }) => {
  const [web3js, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);

  const TicketingFactoryAddress = "0x6c24ad330B9D401efdA0596D51f89F5A72180D7c";

  const initWeb3 = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
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

  const disconnect = async () => {
    setAccounts(null);
    setContract(null);
    setConnected(false);
  };

  useEffect(() => {
    initWeb3();
  }, []);

  return (
    <TicketingContext.Provider value={{ web3js, accounts, contract, connected, initWeb3, disconnect}}>
      {children}
    </TicketingContext.Provider>
  );
};

export const useTicketing = () => useContext(TicketingContext);
