import React, { useState } from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';
import Square from './Square';

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

  const [formInputOne, setFormInputOne] = useState('');
  const [formInputTwo, setFormInputTwo] = useState('');
  const [isSwapped, setIsSwapped] = useState(false);
  const [isChosen, setIsChosen] = useState(false);

  function handleSwapClick() {
    setIsSwapped(true);
  }

  return (
    <div className="Home" /* style={{ paddingBottom: '150px' }} */>

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
