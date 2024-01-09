import React, { useState, useEffect, useContext } from "react";
import { ProtocolsContext } from "../containers/ProtocolsContext";
import testnetMap from "../constants/testnet_map.json"; // Import the JSON file

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProtocols, setFilteredProtocols] = useState([]);
  const { addProtocol, selectProtocol } = useContext(ProtocolsContext);

  useEffect(() => {
    // Extract protocol names from testnet_map and initialize filteredProtocols
    const protocolNames = Object.values(testnetMap).map((entry) => entry.name);
    setFilteredProtocols(protocolNames);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter protocol names based on search query
    const filtered = Object.values(testnetMap)
      .map((entry) => entry.name)
      .filter((name) => name.toLowerCase().includes(query));

    setFilteredProtocols(filtered);
  };

  return (
    <div className="relative flex-1">
      <input
        className="w-full p-4 rounded-md"
        type="search"
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => setFilteredProtocols(Object.values(testnetMap).map(entry => entry.name))}
        onBlur={() => setTimeout(() => setFilteredProtocols([]), 100)}
        style={{
          backgroundColor: "transparent",
          border: "1px solid #4B5563",
          borderRadius: "18px",
          padding: "10px 20px",
        }}
        placeholder="Search Protocols"
      />
      {filteredProtocols.length > 0 && (
        <ul className="absolute z-10 w-full bg-black border border-gray-700 rounded-md mt-1">
          {filteredProtocols.map((protocol, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setSearchQuery(protocol);
                selectProtocol(protocol); // Handle protocol selection logic
              }}
            >
              {protocol}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
