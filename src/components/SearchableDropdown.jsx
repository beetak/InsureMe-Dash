import React, { useEffect, useState } from 'react';

const SearchableDropdown = ({ placeholderText, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            const response = await fetch('https://restcountries.com/v3.1/all');
            const data = await response.json();
            const formattedCountries = data.map(country => ({
                value: country.alpha2Code,
                label: country.name.common,
                flag: country.flags.png
            }));
            setCountries(formattedCountries);
        };

        fetchCountries();
    }, []);

    const filteredOptions = countries.filter(country =>
        country.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setSearchTerm('');
        setIsOpen(false);
        // Call the onChange prop with the selected option
        if (onChange) {
            onChange(option);
        }
    };

    return (
        <div className="mt-2 flex-1">
            <div
                className="border border-gray-300 bg-white rounded-xs px-3 py-2 cursor-pointer text-gray-400 text-[14px]"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? (
                    <div className='flex items-center text-black'>
                        <img src={selectedOption.flag} alt={`${selectedOption.label} flag`} style={{ width: '20px', height: '15px', marginRight: '8px' }} />
                        {selectedOption.label}
                    </div>
                ) : (
                    placeholderText
                )}
            </div>

            {isOpen && (
                <div className="flex relative w-full">
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xs shadow-lg">
                        <input
                            type="text"
                            className="px-3 py-2 border-b border-gray-300 w-full focus:outline-none"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="max-h-40 overflow-y-auto">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        <div className="flex items-center">
                                            <img src={option.flag} alt={`${option.label} flag`} style={{ width: 20, marginRight: 10 }} />
                                            {option.label}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-gray-500">No options found</div>
                            )}
                        </div>
                    </div>
                </div>                
            )}
        </div>
    );
};

export default SearchableDropdown;