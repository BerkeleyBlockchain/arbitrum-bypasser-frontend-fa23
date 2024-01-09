import React, { useState, useEffect, useContext } from "react";
import { ProtocolsContext } from "../containers/ProtocolsContext";
import testnetMap from "../constants/testnet_map.json"; // Import the JSON file

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProtocols, setFilteredProtocols] = useState([]);
  const [isFocused, setIsFocused] = useState(false); // State to track focus
  const { addProtocol, selectProtocol } = useContext(ProtocolsContext);
  const [filterType, setFilterType] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Initialize with all protocol names or filtered by type
    const initialProtocols = filterType 
      ? Object.values(testnetMap).filter(entry => entry.type === filterType)
      : Object.values(testnetMap);
    setFilteredProtocols(initialProtocols.map(entry => entry.name));
  }, [filterType]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter protocol names based on search query and type
    const filtered = Object.values(testnetMap)
      .filter(entry => (filterType ? entry.type === filterType : true))
      .map(entry => entry.name)
      .filter(name => name.toLowerCase().includes(query));

    setFilteredProtocols(filtered);
  };

  const handleProtocolSelect = (protocol) => {
    setSearchQuery(protocol);
    selectProtocol(protocol); // Handle protocol selection logic
    setIsFocused(false); // Hide dropdown after selection
    setFilteredProtocols([]); // Reset filtered protocols
  };

  const handleFilterSelect = (type) => {
    setFilterType(type);
    setIsDropdownOpen(false);
  };
  
  // get all unique types
  const protocolTypes = Array.from(new Set(Object.values(testnetMap).map(entry => entry.type)));

  return (
    <div className="relative flex-1">
      <div className="flex gap-2">
        <input
          className="w-full p-4 rounded-md"
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #4B5563",
            borderRadius: "18px",
            padding: "10px 20px",
          }}
          placeholder="Search Protocols"
        />
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>Filter</button>
        {isDropdownOpen && (
          <ul className="absolute z-10 bg-white border border-gray-700 rounded-md mt-1">
            {protocolTypes.map((type, index) => (
              <li key={index} className="p-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleFilterSelect(type)}>
                {type}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isFocused && filteredProtocols.length > 0 && (
        <ul className="absolute z-10 w-full bg-black border border-gray-700 rounded-md mt-1">
          {filteredProtocols.map((protocol, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleProtocolSelect(protocol)}
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
