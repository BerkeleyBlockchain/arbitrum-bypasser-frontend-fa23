import { React } from "react";
import { useState } from "react";
import "./Landing.css";
import ProtocolCard from "../components/ProtocolCard";
import testnetMap from "../constants/testnet_map.json";

import SearchBar from "../components/SearchBar";

const protocols = Object.values(testnetMap).map((value) => value.name);

export default function Landing() {
  const [selectedProtocol, setSelectedProtocol] = useState("");
  const squaresData = testnetMap;

  const handleSelectProtocol = (protocol) => {
    setSelectedProtocol(protocol);
  };

  const filteredSquaresData = selectedProtocol
    ? Object.entries(squaresData).filter(
        ([key, value]) => value.name === selectedProtocol
      )
    : Object.entries(squaresData);

  return (
    <div className="landing-bg bg-cover bg-no-repeat text-white min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-2">
          Execute Transactions from your ETH account
        </h1>
        <p className="mb-8">
          Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
          ipsum.
        </p>
        <div className="flex gap-4 mb-10">
          <SearchBar
            protocols={protocols}
            onSelectProtocol={handleSelectProtocol}
          />
          <button className="p-4 rounded-md">Filter</button>
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
