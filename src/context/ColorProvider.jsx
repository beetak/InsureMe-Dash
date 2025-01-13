// src/context/ColorContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [colors, setColors] = useState({
    mainColor: '#0B56AC',
    secondaryColor: '#374151'
  });
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    // Set CSS variables whenever colors change
    document.documentElement.style.setProperty('--main-color', colors.mainColor);
    document.documentElement.style.setProperty('--secondary-color', colors.secondaryColor);
    document.documentElement.style.setProperty('--main-color-rgb', colors.mainColorRgb);
    document.documentElement.style.setProperty('--secondary-color-rgb', colors.secondaryColorRgb);
  }, [colors]);

    const updateColors = async (user) => {
        if (!user || !user.companyId) {
            console.error('User or companyId not available');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8083/api/v1/insurers/${user.companyId}`);
            const data = await response.json();
            // Function to convert hex to RGB
            const hexToRgb = (hex) => {
              const bigint = parseInt(hex.slice(1), 16);
              return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
            };

            setColors({
                mainColor: data.mainColor,
                secondaryColor: data.secondColor,
                mainColorRgb: hexToRgb(data.mainColor),
                secondaryColorRgb: hexToRgb(data.secondColor)
            });
            setCompanyDetails(data);

        } catch (error) {
            console.error('Failed to fetch company colors:', error);
        }
    };

  return (
    <ColorContext.Provider value={{ colors, updateColors, companyDetails }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = () => useContext(ColorContext);

export default ColorContext