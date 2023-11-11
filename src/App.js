import React from 'react';
import './App.css';
import { FaTwitter, FaDiscord, FaSearch, FaFilter, FaExchangeAlt } from 'react-icons/fa';

function App() {
  return (
    <div className="App">
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded flex items-center">
            <span className="h-3 w-3 border-2 border-white rounded-full mr-2"></span>
            Transactions
          </button>
        </div>
        <h1 className="text-2xl font-bold">Your Logo Here</h1>
        <div className="flex items-center">
          <FaTwitter className="text-white ml-4 mr-2" size={24} />
          <FaDiscord className="text-white mx-2" size={24} />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">
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
      <div className="flex justify-center items-start mt-8 mb-8">
        <div className="relative inline-block w-full px-6 py-6 rounded-lg bg-gray-800 shadow-lg" style={{ maxWidth: '800px', backgroundColor: 'rgba(17, 19, 24, 1)' }}>
          {/* ... transaction card content */}
          <div className="flex items-center text-sm font-medium">
            <div className="w-1/2 text-left">
              <p className="text-white"><span style={{ color: 'rgba(99, 117, 146, 1)' }}>From:</span> Ethereum Mainnet</p>
              <div className="mt-3 px-4 py-2 rounded shadow flex items-center justify-center" style={{ backgroundColor: 'rgba(25, 29, 36, 1)' }}>
                <p className="text-white">1.5 ETH</p>
              </div>
              <p className="text-white mt-2"><span style={{ color: 'rgba(99, 117, 146, 1)' }}>Balance: 0.5 </span> <span className="text-blue-500">MAX</span></p>
            </div>
            <div className="mx-4">
              <FaExchangeAlt className="text-white text-2xl" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex flex-col items-start">
                <p className="text-white"><span style={{ color: 'rgba(99, 117, 146, 1)' }}>To:</span> Interstellar Mainnet</p>
                <div className="mt-3 px-4 py-2 rounded shadow flex items-center justify-center w-full" style={{ backgroundColor: 'rgba(25, 29, 36, 1)' }}>
                  <p className="text-white">1500 IST</p>
                </div>
                <p className="text-white mt-2"><span style={{ color: 'rgba(99, 117, 146, 1)' }}>Balance: 0.5 </span> <span className="text-blue-500">MAX</span></p>
              </div>
            </div>
          </div>
          <hr className="my-4 border-gray-700" />
          <div className="text-left text-white text-xs">
            <p>Rate: 1 ETH = 1915.48 ARB <span style={{ color: 'rgba(99, 117, 146, 1)' }}>($1586.04) </span> SWAP FEE: $10 USD</p>
          </div>
          <div className="flex justify-center mt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full mx-2">
              Swap
            </button>
            <button className="text-white py-2 px-6 rounded-full mx-2" style={{ border: '1px solid rgba(61, 110, 255, 0.49)', background: 'transparent' }}>
              Choose Protocol
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center ml-8">
          <div className="flex flex-col justify-between items-start h-full">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
              <span className="text-xs text-white ml-2">Starting Swap</span>
            </div>
            <div className="h-16 w-1 bg-blue-600" style={{ marginLeft: '15px' }}></div>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <span className="text-xs text-white ml-2">Crossing Bridge</span>
            </div>
            <div className="h-16 w-1 bg-blue-600" style={{ marginLeft: '15px' }}></div>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <span className="text-xs text-white ml-2">Approving Transfer</span>
            </div>
            <div className="h-16 w-1 bg-blue-600" style={{ marginLeft: '15px' }}></div>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
              <span className="text-xs text-white ml-2">Complete</span>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default App;
