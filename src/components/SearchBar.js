import React, { useState, useEffect, useContext } from "react";
import { ProtocolsContext } from "../containers/ProtocolsContext";
import testnetMap from "../constants/testnet_map.json"; // Import the JSON file

const SearchBar = ({ onSearch, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false); // State to track focus
  const { addProtocol, selectProtocol } = useContext(ProtocolsContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);


  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    onSearch(query); // Notify Landing component of the search query change
  };

  const toggleFilter = (type) => {
    const newFilters = selectedFilters.includes(type)
      ? selectedFilters.filter(t => t !== type)
      : [...selectedFilters, type];
    setSelectedFilters(newFilters);
    onFilter(newFilters);
  };
  
  // get all unique types
  const protocolTypes = Array.from(new Set(Object.values(testnetMap).map(entry => entry.type)));

  return (
    <div className="relative flex flex-1 gap-2">
      <input
        className="flex-1 px-4 py-2 rounded-md bg-transparent border border-gray-600" // Adjusted the width class
        type="search"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search Protocols"
      />

      <div className="relative">
        <button 
          className="px-4 py-2 rounded-md bg-blue-600 text-white"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Filter
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 z-10 w-48 mt-1 bg-gray-800 border border-gray-700 rounded-md">
            {protocolTypes.map((type, index) => (
              <div key={index} className="px-2 py-1">
                <label className="flex items-center cursor-pointer text-white">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedFilters.includes(type)}
                    onChange={() => toggleFilter(type)}
                  />
                  {type}
                </label>
              </div>
            ))}
            <div className="text-center">
              <button 
                className="w-full px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsDropdownOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
