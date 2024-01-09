import React, { useState, useEffect, useContext } from "react";
import { ProtocolsContext } from "../containers/ProtocolsContext";
import testnetMap from "../constants/testnet_map.json"; // Import the JSON file

const SearchBar = ({ onSearch, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false); // State to track focus
  const { addProtocol, selectProtocol } = useContext(ProtocolsContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    onSearch(query); // Notify Landing component of the search query change
  };

  const handleFilterSelect = (type) => {
    setIsDropdownOpen(false);
    onFilter(type); // Notify Landing component of the filter type change
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
    </div>
  );
};

export default SearchBar;
