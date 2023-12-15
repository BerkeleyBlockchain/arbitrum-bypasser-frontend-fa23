import React from "react";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/transactions");
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button
          onClick={handleClick}
          className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <span className="h-3 w-3 border-2 border-white rounded-full mr-2"></span>
          Transactions
        </button>
      </div>
      <div className="flex items-center">
        <FaTwitter className="text-white ml-4 mr-2" size={24} />
        <FaDiscord className="text-white mx-2 mr-4" size={24} />
        <ConnectButton></ConnectButton>
      </div>
    </nav>
  );
}
