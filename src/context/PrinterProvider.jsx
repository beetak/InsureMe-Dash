import React, { createContext, useContext, useState } from 'react';

const PrintContext = createContext();

export const PrintProvider = ({ children }) => {
  const [printData, setPrintData] = useState(null);

  return (
    <PrintContext.Provider value={{ printData, setPrintData }}>
      {children}
    </PrintContext.Provider>
  );
};

export const usePrint = () => useContext(PrintContext);