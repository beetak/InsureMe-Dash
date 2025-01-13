'use client';

import React, { useState } from 'react';

const MultipleSelect = ({ placeholder = 'Select options...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Define options within the component
  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'nextjs', label: 'Next.js' },
  ];

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.some((item) => item.value === option.value)
        ? prev.filter((item) => item.value !== option.value)
        : [...prev, option]
    );
  };

  const removeOption = (option) => {
    setSelectedOptions((prev) => prev.filter((item) => item.value !== option.value));
  };

  return (
    <div className="relative w-full max-w-xs">
      <div
        className="flex flex-wrap items-center border border-gray-300 rounded-md p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length > 0 ? (
          selectedOptions.map((option) => (
            <span
              key={option.value}
              className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded flex items-center"
            >
              {option.label}
              <span
                className="ml-1 h-4 w-4 cursor-pointer text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option);
                }}
              >
                &times; {/* Using HTML entity for "X" */}
              </span>
            </span>
          ))
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <span className="ml-auto h-5 w-5 text-gray-400">&#9662;</span> {/* Using HTML entity for down arrow */}
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedOptions.some((item) => item.value === option.value) ? 'bg-blue-50' : ''
              }`}
              onClick={() => toggleOption(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultipleSelect;