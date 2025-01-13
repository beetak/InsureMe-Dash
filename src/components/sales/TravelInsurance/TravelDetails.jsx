import React, { useContext, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import SearchableDropdown from '../../SearchableDropdown';
import { StepperContext } from '../../../context/StepperContext';
import continents from './../../continents.json'

export default function TravelDetails() {

    const { travelData, setTravelData} = useContext(StepperContext)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTravelData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    const handleDateChange = (name) => (date) => {
      const formattedDate = date ? date.toISOString().split('T')[0] : null;
      setTravelData({ ...travelData, [name]: formattedDate });
    };

    const handleCountryChange = (name) => (selectedCountry) => {
      if (name === 'destination') {
        const selectedContinent = Object.keys(continents[0]).find(continent => 
          continents[0][continent].some(country => country.name === selectedCountry.label)
        );
        setTravelData(prevData => ({
          ...prevData,
          [name]: selectedCountry.label,
          continent: selectedContinent || ''
        }));
      } else {
        setTravelData(prevData => ({
          ...prevData,
          [name]: selectedCountry.label
        }));
      }
    };

    const calculatedDuration = () => {
      const { fromDate, toDate } = travelData;
      if (!fromDate || !toDate) {
        return 0;
      }
      if (fromDate > toDate) {
        return "Invalid";
      }

      const start = new Date(fromDate);
      const end = new Date(toDate);
      const differenceInTime = end - start;
      const differenceInDays = differenceInTime / (1000 * 3600 * 24) + 1;

      return Math.ceil(differenceInDays);
    };
    
    const handleCurrency = (currencyType) => {
      setTravelData({...travelData, currency: currencyType})
    };

    return (
        <>
            <div className="sm:col-span-3 flex items-center">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                Residence Country
              </label>
              <SearchableDropdown 
                placeholderText="Residence Country"
                onChange={handleCountryChange('residence')}
                value={travelData.residence}
              />
            </div>
            <div className="sm:col-span-3 flex items-center">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                Destination Country
              </label>
              <SearchableDropdown 
                placeholderText="Destination Country"
                onChange={handleCountryChange('destination')}
                value={travelData.destination}
              />
            </div>
            <div className="sm:col-span-3 flex items-center">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                Travel Duration
              </label>
              <div className="grid grid-cols-3 items-center justify-between border border-gray-300 gap-2 mt-2 flex-1">
                <div className="flex p-1 px-2 border-r border-gray-300">
                  <h6 className='mr-3'>Depature Date:</h6>
                  <DatePicker
                    id="fromDate"
                    name="fromDate"
                    showPopperArrow
                    selected={travelData.fromDate}
                    onChange={handleDateChange('fromDate')}
                    minDate={new Date()}
                    className='w-[105px] outline-none rounded-3xl bg-gray-200 px-3 cursor-pointer'
                  />
                </div>
                <div className="flex p-1 px-2 border-r border-gray-300">
                  <h6 className='mr-3'>Return Date:</h6>
                  <DatePicker
                    id="toDate"
                    name="toDate"
                    showPopperArrow
                    selected={travelData.toDate}
                    onChange={handleDateChange('toDate')}
                    minDate={new Date()}
                    className='w-[105px] outline-none rounded-3xl bg-gray-200 px-3 cursor-pointer'
                  />
                </div>
                <div className="flex p-1 px-2">
                  <p>Duration: <span>{calculatedDuration()} Days</span></p>
                </div>
              </div>
            </div>
            <div className="flex items-center w-full mt-2">
              <label htmlFor="surname" className="block text-sm font-medium leading-4 text-gray-900 w-1/6">
                Travel Plan
              </label>
              <div className="mt-2 flex-1">
                <select
                  id="planName"
                  name="planName"
                  className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                  onChange={handleChange}
                  value={travelData["planName"] || ""}
                >
                  <option className="font-bold italic text-indigo-600">Plan</option>
                  <option value={"STUDENT"}>STUDENT</option>
                  <option value={"CORPORATE"}>CORPORATE</option>
                  <option value={"NORMAL"}>NORMAL</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                  Currency
              </label>
              <div className="mt-2 flex-1 flex space-x-8">
                <div className="flex items-center">
                  <input
                      id="USD"
                      name="currency"
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600"
                      checked={travelData.currency === 'USD'}
                      onChange={() => handleCurrency('USD')}
                  />
                  <label htmlFor="USD" className="ml-2 text-gray-900">
                      USD
                  </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="ZIG"
                      name="currency"
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600"
                      checked={travelData.currency === 'ZIG'}
                      onChange={() => handleCurrency('ZIG')}
                    />
                    <label htmlFor="ZIG" className="ml-2 text-gray-900">
                      ZIG
                    </label>
                  </div>
                </div>
              </div>
        </>
    )
}

