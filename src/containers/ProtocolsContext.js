import react, { createContext, useState } from "react";

export const ProtocolsContext = createContext();

export const ProtocolsProvider = ({ children }) => {
    const [protocols, setProtocols] = useState(["Uniswap", "1Inch"]); // Initial state
  
    const addProtocol = (newProtocol) => {
      setProtocols((prevProtocols) => [...prevProtocols, newProtocol]);
    };
  
    // Function to select a protocol, you can add the implementation as needed
    const selectProtocol = (protocol) => {
      // Placeholder for any logic you might want for selecting a protocol
    };
  
    const value = { protocols, addProtocol, selectProtocol };
  
    return (
      <ProtocolsContext.Provider value={value}>
        {children}
      </ProtocolsContext.Provider>
    );
  };