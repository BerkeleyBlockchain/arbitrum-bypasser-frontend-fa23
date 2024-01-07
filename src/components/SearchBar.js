import React, { useState, useContext } from "react";
import { ProtocolsContext } from "../containers/ProtocolsContext";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newProtocol, setNewProtocol] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Use useContext to access the protocols and functions from the context
  const { protocols, addProtocol, selectProtocol } = useContext(ProtocolsContext);

  const filteredProtocols = protocols.filter((p) =>
    p.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNewProtocol = () => {
    if (newProtocol && !protocols.includes(newProtocol)) {
      addProtocol(newProtocol); // Add protocol using the function from context
      setNewProtocol("");
    }
  };

  return (
    <div className="relative flex-1">
      <input
        className="w-full p-4 rounded-md"
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => {
          setTimeout(() => {
            setShowDropdown(false);
          }, 100);
        }}
        style={{
          backgroundColor: "transparent",
          border: "1px solid #4B5563",
          borderRadius: "18px",
          padding: "10px 20px",
        }}
        placeholder="Search Protocols"
      />
      {showDropdown && (
        <ul className="absolute z-10 w-full bg-black border border-gray-700 rounded-md mt-1">
          {filteredProtocols.map((protocol) => (
            <li
              key={protocol}
              className="p-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setSearchQuery(protocol);
                setShowDropdown(false);
                selectProtocol(protocol); // Select protocol using the function from context
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
