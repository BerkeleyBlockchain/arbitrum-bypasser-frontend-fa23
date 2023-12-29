import React from 'react';
import { ethers } from 'ethers';

const MetaMaskSignMessageComponent = ({ message }) => {
  const signMessage = async (message) => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const messageHash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(message)); // Message is encrypted using sha256, this can be changed. 

      const signature = await window.ethereum.request({
        method: 'eth_sign',
        // params: [account, window.ethers.utils.hexlify(window.ethers.utils.toUtf8Bytes(message))],
        params: [account, messageHash],
      });
      console.log('Signed message:', signature);
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
    }
  };

  const buttonStyle = {
    color: 'white', // Text color
    backgroundColor: 'black', // Button background color
    padding: '10px 20px', // Padding inside the button
    border: 'none', // No border
    borderRadius: '5px', // Rounded corners
    cursor: 'pointer', // Pointer cursor on hover
    fontSize: '16px', // Font size
  };

  return (
    <button onClick={() => signMessage(message)} style={buttonStyle} className="sign-message-button">
      Sign Message
    </button>
  );
};

export default MetaMaskSignMessageComponent;
