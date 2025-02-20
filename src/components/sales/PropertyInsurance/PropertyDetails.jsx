import React, { useEffect, useState, useContext } from 'react'
import { fetchAsyncPolicy, getPolicies } from '../../../store/policy-store'
import { useDispatch, useSelector } from 'react-redux'
import { StepperContext } from '../../../context/StepperContext'
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi'
import useAuth from '../../../hooks/useAuth'

export default function PropertyDetails({ onChange }) {

    const { propertyData, setPropertyData } = useContext(StepperContext)

    const { user, setUser } = useAuth()

    useEffect(()=>{
        setupInterceptors(()=>user, setUser)
    },[])

    const handleChange = (e) => {
        const { name, value } = e.target
        setPropertyData({...propertyData, [name] : value})
    }

    const handleCurrency = (currencyType) => {
        setPropertyData({...propertyData, currency: currencyType})
      };

    const dispatch = useDispatch()

    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(1)
    const [countP, setCountP] = useState(1)

    useEffect(()=>{
        dispatch(fetchAsyncPolicy())
    },[])

    const decrement = (index) => {
        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows.splice(index, 1);
          return updatedRows;
        });
        setCount((prevCount) => prevCount - 1);
    };

    const increment = () => {
        setCount(prevCount=>prevCount+1)
    }

    const decrementP = (index) => {
        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows.splice(index, 1);
          return updatedRows;
        });
        setCountP((prevCount) => prevCount - 1);
      };

    const incrementP = () => {
        setCountP(prevCount=>prevCount+1)
    }

    const moneyFomart = ({ amount, currency = 'USD', locale = 'en-US' }) => {
        const formattedAmount = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)

        return (
            formattedAmount
        )
    }

    return (
        <>
            {[...Array(count)].map((_, index) => (
                <div key={index} className="flex items-start mt-2">
                    <label htmlFor={`address-${index}`} className="block text-sm font-medium leading-6 text-gray-900 w-1/6 mt-3">
                        {/* Building Row {++index} */}
                        Building Row
                    </label>
                    <div className="flex-col flex-1">
                        <div className="flex items-center space-x-2 flex-1">
                            <div className="mt-2 flex-1">
                                <input
                                    type="text"
                                    name="homeAddress"
                                    id="homeAddress"
                                    autoComplete="family-name"
                                    placeholder="Risk Address"
                                    onChange={handleChange}
                                    value={propertyData["homeAddress"] || ""}
                                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="mt-2 flex-1">
                                <input
                                    type="text"
                                    name="value"
                                    id="value"
                                    autoComplete="family-name"
                                    placeholder="Value of buildings"
                                    onChange={handleChange}
                                    value={propertyData["value"] || ""}
                                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="mt-2 flex-1">
                                <select
                                    id="roofType"
                                    name="roofType"
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5 w-full"
                                    onChange={handleChange}
                                    value={propertyData["roofType"] || ""}
                                >
                                    <option className='font-bold italic text-gray-400'>House Roof Type</option>
                                    <option value="METAL_SLATE">Metal Slate</option>
                                    <option value="TILE">Tile</option>
                                    <option value="ASBESTOS">Asbestos</option>
                                    <option value="WOOD">Wood</option>
                                    <option value="THATCH">Thatch</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="mt-2 flex-1">
                                <select
                                    id="houseConstruction"
                                    name="houseConstruction"
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5 w-full"
                                    onChange={handleChange}
                                    value={propertyData["houseConstruction"] || ""}
                                >
                                    <option className='font-bold italic text-gray-400'>House Construction</option>
                                    <option value="BRICK">Brick</option>
                                    <option value="WOOD">Wood</option>
                                    <option value="CONCRETE">Concrete</option>
                                </select>
                            </div>
                            <div className="mt-2 flex-1">
                                <select
                                    id="houseDescription"
                                    name="houseDescription"
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5 w-full"
                                    onChange={handleChange}
                                    value={propertyData["houseDescription"] || ""}
                                >
                                    <option className='font-bold italic text-gray-400'>House Description</option>
                                    <option value="STAND_ALONE">Stand Alone</option>
                                    <option value="SEMI_DETACHED">Semi Detached</option>
                                    <option value="FLAT">Flat</option>
                                </select>
                            </div>
                            <div className="mt-2 flex-1">
                                <select
                                    id="policy"
                                    name="policy"
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5 w-full"
                                    onChange={handleChange}
                                    value={propertyData["policy"] || ""}
                                >
                                    <option className='font-bold italic text-gray-400'>Policy</option>
                                    <option value="DOMESTIC_COMBINED_STANDARD_CONSTRUCTION">Domestic Combined Standard Construction</option>
                                    <option value="DOMESTIC_COMBINED_NON_STANDARD_CONSTRUCTION">Domestic Combined non Standard Construction</option>
                                </select>
                            </div>
                            <div className="mt-2 flex-1">
                                <select
                                    id="policyType"
                                    name="policyType"
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5 w-full"
                                    onChange={handleChange}
                                    value={propertyData["policyType"] || ""}
                                >
                                    <option className='font-bold italic text-gray-400'>Policy Type</option>
                                    <option value="HOUSE_OWNERS">House Owners</option>
                                    <option value="HOUSE_HOLDERS">House Holders</option>
                                    <option value="ALL_RISK">All Risk</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* {
                        index === count ? (
                            count < 3 ? (
                                <span onClick={increment} className="fas fa-plus px-3 bg-gray-300 rounded-full py-0.5 mx-2 mt-4" />
                            ) : (
                                <span onClick={() => decrement(index)} className="bg-gray-300 rounded-full fas fa-minus px-3 py-0.5 mx-2 mt-4" />
                            )
                            ) : (
                                <span onClick={() => decrement(index)} className="bg-gray-300 rounded-full fas fa-minus px-3 py-0.5 mx-2 mt-4" />
                            )
                    } */}
                </div>
            ))}
            <hr className='mt-2'/>
            {[...Array(countP)].map((_, index) => (
                <div key={index} className="sm:col-span-3 flex items-center mt-2">
                    <label htmlFor={`address-${index}`} className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        {/* Property Row {++index} */}
                        Property Row
                    </label>
                    <div className="sm:col-span-3 flex items-center space-x-2 flex-1">
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="propertyAddress"
                                id="propertyAddress"
                                autoComplete="family-name"
                                placeholder="Risk Address"
                                onChange={handleChange}
                                value={propertyData["propertyAddress"] || ""}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="propertyValue"
                                id="propertyValue"
                                autoComplete="family-name"
                                placeholder="Value of contents"
                                onChange={handleChange}
                                value={propertyData["propertyValue"] || ""}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    {/* {
                        index === countP ? (
                            countP < 3 ? (
                                <span onClick={incrementP} className="fas fa-plus px-3 bg-gray-300 rounded-full py-0.5 mx-2" />
                            ) : (
                                <span onClick={() => decrementP(index)} className="bg-gray-300 rounded-full fas fa-minus px-3 py-0.5 mx-2" />
                            )
                            ) : (
                                <span onClick={() => decrementP(index)} className="fas fa-minus px-3 bg-gray-300 rounded-full py-0.5 mx-2" />
                            )
                    } */}
                </div>
            ))}

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
                            checked={propertyData.currency === 'USD'}
                            onChange={() => handleCurrency('USD')}
                        />
                        <label htmlFor="USD" className="ml-2 text-gray-900">
                            USD
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="ZWG"
                            name="currency"
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-indigo-600"
                            checked={propertyData.currency === 'ZWG'}
                            onChange={() => handleCurrency('ZWG')}
                        />
                        <label htmlFor="ZWG" className="ml-2 text-gray-900">
                            ZWG
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}

