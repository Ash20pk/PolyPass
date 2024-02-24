import React, { useState } from 'react';
import { useTicketing } from './TicketingContext';
import axios from 'axios';
import '../styles/TicketCreation.css';
import {Button, Stack, TextField} from '@mui/material';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

const TicketCreation = () => {
  const { contract, accounts } = useTicketing();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [eventName, setEventName] = useState('');
  const [price, setPrice] = useState('');
  const [maxTicket, setMaxTicket] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Function to handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file)); // Set preview image URL
  };

  // Function to create ticket
  const handleCreateTicket = async () => {
    try {
      setLoading(true);
      setError(null);

      // Upload image to IPFS and get URI
      const ipfsURI = await uploadToIPFS(imageFile);

      // Call the contract's createTicketingContract method with URI
      console.log(name, symbol, price, maxTicket, eventName, ipfsURI, accounts)
      await contract.methods.createTicketingContract(name, symbol, price, maxTicket, eventName, ipfsURI).send({ from: accounts });

      // Get the latest contract address after creation
      const contracts = await contract.methods.getUserContracts(accounts).call({ from: accounts });
      const latest = contracts.length > 0 ? contracts[contracts.length - 1] : '';
      setContractAddress(latest);

      alert('Ticket created successfully!');
    } catch (error) {
      setError(error.message || 'An error occurred while creating the ticket.');
      console.error('Error creating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to upload image to IPFS
  const uploadToIPFS = async (image) => {
    try {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

        // Create form data
        let formData = new FormData();
        formData.append('file', image);

        const metadata = JSON.stringify({
            name: 'Ticket Image',
        });
        formData.append('pinataMetadata', metadata);

        const options = JSON.stringify({
            cidVersion: 0,
        });
        formData.append('pinataOptions', options);

        const res = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'pinata_api_key': 'd1142b635c7d76135866',
                'pinata_secret_api_key': '8dcde5998daa70f74397623aa43ff9875f943856c31d7508ee6e0bb432464efb',
            },
        });

        const ipfsURI = `ipfs://${res.data.IpfsHash}`;

        return ipfsURI;
    } catch (error) {
        setError(error.message || 'An error occurred while uploading image to IPFS.');
        console.error('Error uploading image to IPFS:', error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="ticket-creation-container">
      <h2>Create a New Ticket</h2>
      <div className="preview-card">
      {previewImage && <img src={previewImage} alt="Ticket Preview" className="preview-image-bigger" />}
      </div>
      <Stack direction="column" spacing={2} justifyContent="center" alignItems="center">
        <TextField id="outlined-basic" label="Name" variant="outlined" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        <TextField id="outlined-basic" label="Symbol" variant="outlined" margin="normal" type="text" placeholder="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="input-field" />
        <TextField id="outlined-basic" label="Event Name" variant="outlined" margin="normal" type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} className="input-field" />
        <TextField id="outlined-basic" label="Price" variant="outlined" margin="normal" type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" />
        <TextField id="outlined-basic" label="Max Ticket" variant="outlined" margin="normal" type="number" placeholder="Max Ticket" value={maxTicket} onChange={(e) => setMaxTicket(e.target.value)} className="input-field" />
        {/* Input for file upload */}
        <Button component="label" role={undefined} variant="contained" onChange={handleFileChange} > Choose Image <VisuallyHiddenInput type="file" /></Button>
      <Button variant='contained'onClick={handleCreateTicket} disabled={loading} className="create-button">
        {loading ? 'Creating...' : 'Create Ticket'}
      </Button>
      {error && <Alert severity="error" className="error-message">{error}</Alert>}
      {contractAddress && <Alert severity="success">Interact with contract: <a href={`/${contractAddress}`} className="contract-link">Share this link</a></Alert>}
      </Stack>
    </div>
  );
};

export default TicketCreation;
