import React, { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import arbLogo from "../assets/arblogo.svg";
import NetworkSwitch from "./NetworkSwitch";

export default function Header() {
  const [disabled, setDisabled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/swap") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [location]);

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  const handleTransaction = () => {
    navigate("/transactions");
  };

  const handleAddABI = () => {
    navigate("/add-abi"); // This will navigate to the Add ABI page
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
        <NetworkSwitch disabledVar={disabled} />
        <ConnectButton showBalance={false} chainStatus="name" />
      </div>
    </nav>
  );
}
