"use client";
import React, { useState } from "react";

export const GlobalContext = React.createContext();

const ContextProvider = ({ children }) => {
  const [livenet, setLivenet] = useState(true);

  return (
    <GlobalContext.Provider value={{ livenet, setLivenet }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
