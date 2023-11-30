import { FaTwitter, FaDiscord, FaSearch, FaFilter, FaCheckCircle } from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Square from './Square'; 
import React, {useState, useEffect} from 'react';

export default function Landing() {

  const squaresData = [
    { name: 'Square 1', type: 'DAPP', imageLink: 'https://via.placeholder.com/200' },
    { name: 'Square 2', type: 'Type B', imageLink: 'https://via.placeholder.com/200' },
    { name: 'Square 3', type: 'Type C', imageLink: 'https://via.placeholder.com/200' },
    { name: 'Square 4', type: 'Type D', imageLink: 'https://via.placeholder.com/200' },
    { name: 'Square 5', type: 'Type E', imageLink: 'https://via.placeholder.com/200' },
    { name: 'Square 6', type: 'Type F', imageLink: 'https://via.placeholder.com/200' },
  ];
  
  const [fromNetwork, setFromNetwork] = useState('Ethereum Mainnet');
  const [ethAmount, setEthAmount] = useState('1.5');
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [formInputOne, setFormInputOne] = useState('');
  const [formInputTwo, setFormInputTwo] = useState('');
  const [isSwapped, setIsSwapped] = useState(false);
  const [isChosen, setIsChosen] = useState(false);

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

  function handleSwapClick() {
    setIsSwapped(true);
  }

  async function connectWallet() {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Connected', accounts[0]);
        setConnectedAccount(accounts[0]);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="Home" style={{ paddingBottom: '150px' }}>
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
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Connect Wallet
            </button>
          </div>
        </nav>

        <div className="text-white text-center mt-32 mb-8">
          <h2 className="text-4xl font-bold mb-8">Execute Transactions from your ETH account</h2>
          <div className="inline-flex justify-center items-center w-full px-4 py-3 rounded-lg bg-gray-800" style={{ maxWidth: '800px', backgroundColor: 'rgba(17, 19, 24, 1)' }}>
            <FaSearch className="text-gray-300 mr-3" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="flex-grow text-white focus:outline-none"
              style={{ backgroundColor: 'rgba(17, 19, 24, 1)' }}
            />
            <button className="ml-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-150 ease-in-out">
              <FaFilter className="text-white" size={20} />
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 200px)', gap: '40px', justifyContent: 'center' }}>
          {squaresData.map(square => (
            <Square key={square.name} name={square.name} type={square.type} imageLink={square.imageLink} />
          ))}
        </div>
      </div>
  )
}
