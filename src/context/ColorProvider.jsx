// src/context/ColorContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import InsuranceApi from '../components/api/InsuranceApi';

const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [colors, setColors] = useState({
    mainColor: '#0B56AC',
    secondaryColor: '#374151'
  });
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--main-color', colors.mainColor);
    document.documentElement.style.setProperty('--secondary-color', colors.secondaryColor);
    document.documentElement.style.setProperty('--main-color-rgb', colors.mainColorRgb);
    document.documentElement.style.setProperty('--secondary-color-rgb', colors.secondaryColorRgb);
  }, [colors]);

  const updateColors = async (user) => {
    if (!user || !user.companyId) {
        return;
    }

    try {
        const data = await InsuranceApi(`/insurers/${user.companyId}`);
        
        // Debugging: log the received data
        console.log('Received data:', data.data);

        const hexToRgb = (hex) => {
            if (!hex) {
                console.error('Hex color is undefined:', hex);
                return '0, 0, 0'; // Default RGB value
            }
            const bigint = parseInt(hex.slice(1), 16);
            return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
        };

        setColors({
            mainColor: data.data.mainColor || '#0B56AC', // Default value if undefined
            secondaryColor: data.data.secondColor || '#fc0303', // Default value if undefined
            mainColorRgb: hexToRgb(data.data.mainColor),
            secondaryColorRgb: hexToRgb(data.data.secondColor)
        });
        setCompanyDetails(data.data);

    } catch (error) {
        console.error('Failed to fetch company colors:', error);
    }
  };

  return (
    <ColorContext.Provider value={{ colors, updateColors, companyDetails, setCompanyDetails }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = () => useContext(ColorContext);

export default ColorContext