import React, { useEffect } from 'react';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './App.css';

import router from './router';
import { setConnectedAccount } from './store';

export default function App() {
  const dispatch = useDispatch();
  const connectedAccount = useSelector(state => state.connectedAccount)

  useEffect(() => {
    checkMetaMask();
  }, []);

  function checkMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    } else {
      console.log('MetaMask is not installed. Please install it.');
    }
  }


  async function connectWallet() {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Connected', accounts[0]);
        dispatch(setConnectedAccount(accounts[0]));
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div>
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded flex items-center">
            <span className="h-3 w-3 border-2 border-white rounded-full mr-2"></span>
            Transactions
          </button>
        </div>
        <div className="flex items-center">
          <FaTwitter className="text-white ml-4 mr-2" size={24} />
          <FaDiscord className="text-white mx-2" size={24} />
          {!connectedAccount && <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Connect Wallet
          </button>}
          {connectedAccount && <div>Logged in</div>}
        </div>
      </nav>
      <RouterProvider router={router} />
    </div>
  )
}
