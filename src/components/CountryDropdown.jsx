import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const CountryDropdown = ({placeholderText}) => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            const response = await fetch('https://restcountries.com/v3.1/all');
            const data = await response.json();
            const formattedCountries = data.map(country => ({
                value: country.alpha2Code,
                label: (
                    <div className="flex items-center">
                        <img src={country.flags.png} alt={`${country.name.common} flag`} style={{ width: 20, marginRight: 10 }} />
                        {country.name.common}
                    </div>
                )
            }));
            setCountries(formattedCountries);
        };

        fetchCountries();
    }, []);

    const handleChange = (selectedOption) => {
        console.log('Selected country:', selectedOption);
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            border: '1px solid #D1D5DB', // Tailwind's gray-300
            boxShadow: 'none',
            borderRadius: 0, // Tailwind's rounded-xs
            width: '100%',
            '&:hover': {
                borderColor: '#6366F1', // Tailwind's indigo-600 on hover
            },
        }),
        input: (provided) => ({
            ...provided,
            color: '#1F2937', // Tailwind's gray-900
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9CA3AF', // Tailwind's gray-400
            fontSize: '14px'
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#E5E7EB' : state.isFocused ? '#F3F4F6' : 'white',
            color: '#1F2937', // Tailwind's gray-900
            '&:hover': {
                backgroundColor: '#F3F4F6', // Tailwind's gray-200 on hover
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#1F2937', // Tailwind's gray-900
        }),
    }

    return (
        <div className="mt-2 flex-1">
            <Select
                options={countries}
                onChange={handleChange}
                placeholder={placeholderText}
                isSearchable
                styles={customStyles}
                classNamePrefix="select"
            />
        </div>
    );
};

export default CountryDropdown;