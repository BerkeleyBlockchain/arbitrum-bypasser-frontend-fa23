import React from 'react';

const MetaMaskSignMessageComponent = ({ message }) => {
  const signMessage = async (message) => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const signature = await window.ethereum.request({
        method: 'eth_sign',
        params: [account, window.ethers.utils.hexlify(window.ethers.utils.toUtf8Bytes(message))],
      });
      console.log('Signed message:', signature);
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
    }
  };

  return (
    <button onClick={() => signMessage(message)} className="sign-message-button">
      Sign Message
    </button>
  );
};

export default MetaMaskSignMessageComponent;
