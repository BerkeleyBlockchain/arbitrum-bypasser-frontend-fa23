import React, { useState, useContext } from "react";
import "./Landing.css";
import ProtocolCard from "../components/ProtocolCard";
import testnetMap from "../constants/testnet_map.json";
import mainnetMap from "../constants/mainnet_map.json";
import SearchBar from "../components/SearchBar";
import { GlobalContext } from "../ContextProvider";

export default function Landing() {
  const { livenet } = useContext(GlobalContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTypes, setFilterTypes] = useState([]); // Now an array

  const handleSearchChange = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleFilterChange = (types) => {
    setFilterTypes(types); // Expecting an array of types
  };

  const filteredSquaresData = Object.entries(
    livenet ? mainnetMap : testnetMap
  ).filter(
    ([key, value]) =>
      (filterTypes.length === 0 || filterTypes.includes(value.type)) && // Adjusted for an array of types
      (!searchQuery || value.name.toLowerCase().includes(searchQuery))
  );

  return (
    <div className="landing-bg bg-cover bg-fixed bg-no-repeat text-white flex-grow py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-6xl font-bold mb-3">
          Arbitrum One Sequencer Bypasser
        </h1>
        <p className="text-gray-400 text-lg mb-6">
          Execute transactions on Arbitrum L2 using your ETH account and reduce
          censorship risks by circumventing both transaction submission and
          transaction inclusion. (This is a community prototype so use at your
          own risk*!)
        </p>

        <div className="flex gap-4 mb-10">
          <SearchBar
            onSearch={handleSearchChange}
            onFilter={handleFilterChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-1 gap-4">
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
