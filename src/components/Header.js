import React, { useState } from 'react';
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import arbLogo from "../assets/arblogo.svg";
import MetaMaskSignMessageComponent from "./EthSign";

export default function Header() {
  const navigate = useNavigate();
  const [network, setNetwork] = useState("Mainnet");

  const handleHome = () => {
    navigate("/");
  };

  const handleTransaction = () => {
    navigate("/transactions");
  };

  const handleLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
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
        {/* Add your MetaMaskSignMessageComponent next to Transactions button */}
        {/* <MetaMaskSignMessageComponent message="Your default message or pass a message prop" /> */}
      </div>
      <div className="flex items-center">
      <button
          onClick={toggleNetwork} //MAINNET TESTNET BUTTON
          className={`${
            network === "Mainnet" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
          } text-white font-thin py-2 px-4 rounded flex items-center mr-2 transition-colors duration-300`}
        >
          {network}
        </button>
        <FaTwitter
          className="text-white ml-4 mr-2 hover:cursor-pointer hover:scale-110"
          onClick={() => {
            handleLink("https://twitter.com/arbitrum");
          }}
          size={24}
        />
        <FaDiscord
          className="text-white mx-2 mr-4 hover:cursor-pointer hover:scale-110"
          onClick={() => {
            handleLink("https://discord.com/invite/arbitrum");
          }}
          size={24}
        />
        <ConnectButton />
      </div>
    </nav>
  );
}
