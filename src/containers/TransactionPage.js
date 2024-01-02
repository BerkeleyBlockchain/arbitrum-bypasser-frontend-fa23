import { useState } from "react";
import "./SwapPage.css";
import SearchBar from "../components/SearchBar";

export default function TransactionPage() {
  const [fromNetwork, setFromNetwork] = useState("Ethereum Mainnet");
  const [ethAmount, setEthAmount] = useState("1.5");

  const [formInputOne, setFormInputOne] = useState("");
  const [formInputTwo, setFormInputTwo] = useState("");
  const [isSwapped, setIsSwapped] = useState(false);
  const [isChosen, setIsChosen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProtocol, setSelectedProtocol] = useState(""); // Selected option
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility

  const [protocols, setProtocols] = useState(["AAVE", "Uniswap", "Compound"]); // Dropdown options

  const addProtocol = (newProtocol) => {
    setProtocols((prevProtocols) => [...prevProtocols, newProtocol]);
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 50);
  };

  const handleSelectProtocol = (protocol) => {
    setSearchQuery(protocol);
    setShowDropdown(false);
  };

  function handleSwapClick() {
    setIsSwapped(true);
  }

  return (
    <div className="swap-bg bg-cover bg-no-repeat text-white min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-2">
          Execute Transactions from your ETH account
        </h1>
        <p className="mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="flex gap-4 mb-10">
          <SearchBar
            protocols={protocols}
            onSelectProtocol={handleSelectProtocol}
          />
          <button className="p-4 rounded-md">Filter</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Your transaction content goes here */}
          Transactions
        </div>
      </div>
    </div>
  );
}
