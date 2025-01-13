import React, { useEffect, useState } from 'react'
import { fetchAsyncPolicy, getPolicies } from '../../../store/policy-store'
import { useDispatch, useSelector } from 'react-redux'

export default function PropertyDetails({ onChange }) {

    const dispatch = useDispatch()

    const [vehicleClass, setVehicleClass] = useState("")
    const [zbcCategory, setZbcCategory] = useState("")
    const [zbcTerm, setZbcTerm] = useState("")
    const [zinaraTerm, setZinaraTerm] = useState("")
    const [insuranceType, setInsuranceType] = useState("")
    const [insuranceTerm, setInsuranceTerm] = useState("")
    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(1)
    const [countP, setCountP] = useState(1)
    const [error, setError] = useState([])

    useEffect(()=>{
        dispatch(fetchAsyncPolicy())
    },[])

    const [policyDetails, setPolicyDetails] = useState({
        zbcCategory,
        vehicleClass,
        zbcTerm,
        zinaraTerm,
        insuranceType,
        insuranceTerm,
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPolicyDetails((prevDetails) => ({
          ...prevDetails,
          [name]: value,
        }));
        onChange(policyDetails);
    };

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
                <div key={index} className="flex items-center mt-2">
                    <label htmlFor={`address-${index}`} className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Building Row {++index}
                    </label>
                    <div className="flex items-center space-x-2 flex-1">
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="coverage"
                                id="coverage"
                                autoComplete="family-name"
                                placeholder="Risk Address"
                                onChange={handleChange}
                                // value={vehicleInfo?vehicleInfo.vehicleMake:vehicleDetails.vehicleMake}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="coverage"
                                id="coverage"
                                autoComplete="family-name"
                                placeholder="Value of buildings"
                                onChange={handleChange}
                                // value={vehicleInfo?vehicleInfo.vehicleMake:vehicleDetails.vehicleMake}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="mt-2 flex-1">
                            <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5 w-full"
                            >
                                <option className='font-bold italic text-gray-400'>Building Type</option>
                                <option value="Option 1">Thatched</option>
                                <option value="Option 2">Non Thatched</option>
                            </select>
                        </div>
                        <div className="mt-2 w-40">
                            <label className='bg-gray-400 text-white justify-end py-1.5 px-3 w-full flex'>{moneyFomart({amount:0})}</label>
                        </div>
                    </div>
                    {
                        index === count ? (
                            count < 3 ? (
                                <span onClick={increment} className="fas fa-plus px-3 bg-gray-300 rounded-full py-0.5 mx-2" />
                            ) : (
                                <span onClick={() => decrement(index)} className="bg-gray-300 rounded-full fas fa-minus px-3 py-0.5 mx-2" />
                            )
                            ) : (
                                <span onClick={() => decrement(index)} className="bg-gray-300 rounded-full fas fa-minus px-3 py-0.5 mx-2" />
                            )
                    }
                </div>
            ))}
            <hr className='mt-2'/>
            {[...Array(countP)].map((_, index) => (
                <div key={index} className="sm:col-span-3 flex items-center mt-2">
                    <label htmlFor={`address-${index}`} className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Property Row {++index}
                    </label>
                    <div className="sm:col-span-3 flex items-center space-x-2 flex-1">
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="coverage"
                                id="coverage"
                                autoComplete="family-name"
                                placeholder="Risk Address"
                                onChange={handleChange}
                                // value={vehicleInfo?vehicleInfo.vehicleMake:vehicleDetails.vehicleMake}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="coverage"
                                id="coverage"
                                autoComplete="family-name"
                                placeholder="Value of contents"
                                onChange={handleChange}
                                // value={vehicleInfo?vehicleInfo.vehicleMake:vehicleDetails.vehicleMake}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="mt-2 w-40">
                            <label className='bg-gray-400 text-white justify-end py-1.5 px-3 w-full flex'>{moneyFomart({amount:0})}</label>
                        </div>
                    </div>
                    {
                        index === countP ? (
                            countP < 3 ? (
                                <span onClick={incrementP} className="fas fa-plus px-3 bg-gray-300 rounded-full py-0.5 mx-2" />
                            ) : (
                                <span onClick={() => decrementP(index)} className="bg-gray-300 rounded-full fas fa-minus px-3 py-0.5 mx-2" />
                            )
                            ) : (
                                <span onClick={() => decrementP(index)} className="fas fa-minus px-3 bg-gray-300 rounded-full py-0.5 mx-2" />
                            )
                    }
                </div>
            ))}
        </>
    )
}

