import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import arbLogo from "../assets/arblogo.svg";
// import MetaMaskSignMessageComponent from "./EthSign";

export default function Header() {
  const navigate = useNavigate();
  const [network, setNetwork] = useState("Mainnet");

  const handleHome = () => {
    navigate("/");
  };

  const handleTransaction = () => {
    navigate("/transactions");
  };

  const handleAddABI = () => {
    navigate("/add-abi"); // This will navigate to the Add ABI page
  };

  const toggleNetwork = () => {
    setNetwork(network === "Mainnet" ? "Testnet" : "Mainnet");
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img
          onClick={handleHome}
          className="mr-4 hover:cursor-pointer hover:scale-110"
          src={arbLogo}
          alt="Arb Logo"
        />
        <button
          onClick={handleTransaction}
          className="bg-gray-700 hover:bg-gray-800 text-white font-thin py-2 px-4 rounded flex items-center mr-2"
        >
          <span className="h-3 w-3 border-2 border-white rounded-full mr-2"></span>
          Transactions
        </button>
        {/* Add the Add ABI button */}
        <button
          onClick={handleAddABI}
          className="bg-gray-700 hover:bg-gray-800 text-white font-thin py-2 px-4 rounded flex items-center mr-2"
        >
          Add ABI
        </button>
        {/* Uncomment and use the MetaMaskSignMessageComponent if needed */}
        {/* <MetaMaskSignMessageComponent message="Your default message or pass a message prop" /> */}
      </div>
      <div className="flex items-center">
        <button
          onClick={toggleNetwork}
          className={`${
            network === "Mainnet" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
          } text-white font-thin py-2 px-4 rounded flex items-center mr-2 transition-colors duration-300`}
        >
          {network}
        </button>
        <ConnectButton />
      </div>
    </nav>
  );
}
