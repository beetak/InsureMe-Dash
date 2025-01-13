import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ColorPickerModal = ({ isOpen, onClose, initialColor, onColorChange }) => {
  const [color, setColor] = useState(initialColor);
  const [hexValue, setHexValue] = useState(initialColor);

  useEffect(() => {
    setColor(initialColor);
    setHexValue(initialColor);
  }, [initialColor]);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    setHexValue(newColor);
    onColorChange(newColor);
  };

  const handleHexChange = (e) => {
    const newHex = e.target.value;
    setHexValue(newHex);
    if (/^#[0-9A-F]{6}$/i.test(newHex)) {
      setColor(newHex);
      onColorChange(newHex);
    }
  };

  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    //   <div className="bg-white p-6 rounded-lg shadow-xl">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-6 rounded-lg shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Choose a Color</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="colorPicker" className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              id="colorPicker"
              value={color}
              onChange={handleColorChange}
              className="w-full h-12 cursor-pointer rounded"
            />
          </div>
          <div>
            <label htmlFor="hexInput" className="block text-sm font-medium text-gray-700 mb-1">
              Hex Value
            </label>
            <input
              type="text"
              id="hexInput"
              value={hexValue}
              onChange={handleHexChange}
              placeholder="#000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ColorPickerModal;