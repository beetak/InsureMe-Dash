import React from 'react';
import useTheme from '../../hooks/useTheme';

const WatermarkedFormContainer = ({ children }) => {
  const {companyDetails} = useTheme()
  return (
    <div className="relative p-5 bg-white rounded-md border border-gray-200 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none bg-no-repeat bg-center bg-contain"
        style={{
          backgroundImage: `url(${companyDetails?.insurerLogo})`,
          zIndex: 0
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default WatermarkedFormContainer;