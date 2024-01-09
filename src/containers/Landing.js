import React, { useState } from "react";
import "./Landing.css";
import ProtocolCard from "../components/ProtocolCard";
import testnetMap from "../constants/testnet_map.json";
import SearchBar from "../components/SearchBar";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const handleSearchChange = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const filteredSquaresData = Object.entries(testnetMap)
    .filter(([key, value]) => 
      (!filterType || value.type === filterType) &&
      (!searchQuery || value.name.toLowerCase().includes(searchQuery))
    );

  return (
    <div className="flex-grow landing-bg bg-cover bg-no-repeat h-full text-white py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-2">
          Execute Transactions from your ETH account
        </h1>
        <p className="mb-8">
          Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
          ipsum.
        </p>
        <div className="flex gap-4 mb-10">
          <SearchBar onSearch={handleSearchChange} onFilter={handleFilterChange} />
          {/* Removed the standalone Filter button as the functionality is integrated into SearchBar */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSquaresData.map(([key, value]) => (
            <ProtocolCard
              key={key}
              addy={key}
              name={value.name}
              type={value.type}
              abi={value.abi}
              image={value.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}