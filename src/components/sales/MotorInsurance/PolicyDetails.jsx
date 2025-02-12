import React, { useContext, useEffect, useState } from 'react'
import { StepperContext } from '../../../context/StepperContext';
import insuranceTypes from './../../insuranceTypes.json'

export default function PolicyDetails() {
    const [zbcActive, setZbcActive] = useState(false);
    const [zinaraActive, setZinaraActive] = useState(false);
    const [policyActive, setPolicyActive] = useState(false);
    
    const { policyData, setPolicyData, setSubscriptionMethod } = useContext(StepperContext)

    useEffect(() => {
        const updateSubMethod = () => {
          if (policyActive && zinaraActive) {
            return 'TPILICQuote'
          } else if (!policyActive && zinaraActive) {
            return 'LICQuote'
          } else if (policyActive && !zinaraActive) {
            return 'TPIQuote'
          } else {
            return 'NoQuote' // Default case when neither policy nor zinara is active
          }
        }
        
        const newMethod = updateSubMethod()
        setSubscriptionMethod(newMethod)
        console.log('Updated subscription method:', newMethod)
    }, [policyActive, zinaraActive, setSubscriptionMethod])

    useEffect(() => {
        setPolicyData(prevData => ({ ...prevData, currency: 'USD' }))
    }, [setPolicyData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setPolicyData({...policyData, [name] : value})
    }

    const handleZbc = () => {
        setPolicyData(prevPolicyData => ({
            ...prevPolicyData,
            RadioTVUsage: "",
            RadioTVFrequency: ""
        }));
        setZbcActive(prev => !prev)
    }

    const handleZinara = () => {
        setPolicyData(prevPolicyData => ({
            ...prevPolicyData,
            LicFrequency: ""
        }));
        setZinaraActive(prev => !prev)
    }

    const handleInsurance = () => {
        setPolicyData(prevPolicyData => ({
            ...prevPolicyData,
            insuranceType: "",
            insuranceTerm: ""
        }));
        setPolicyActive(prev => !prev)
    }

    const handleCurrency = (currencyType) => {
        setPolicyData({...policyData, currency: currencyType})
    };

    return (
        <>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Insurance Policy
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="insuranceType"
                        name="insuranceType"
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        onChange={handleChange}
                        value={policyData["insuranceType"] || ""}
                        disabled={!policyActive}
                    >
                    <option className='font-bold italic text-indigo-600'>Select Policy</option>
                    {
                        insuranceTypes?insuranceTypes.map((policy, index)=>(
                            <option key={index} value={policy.InsuranceType}>{policy.Description}</option>
                        )):<option >No data found</option>
                    }
                    </select>
                </div>
                <div className="flex items-center ml-4 w-28">
                    <input
                        id="policy"
                        name="policy"
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600"
                        checked={policyActive}
                        onChange={handleInsurance}
                    />
                    <label htmlFor="policy" className="ml-2 text-gray-900">
                        Insurance
                    </label>
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Number of Terms
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="insuranceTerm"
                        name="insuranceTerm"
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        onChange={handleChange}
                        value={policyData["insuranceTerm"] || ""}
                    >
                        <option className='font-bold italic text-indigo-600'>Select Number of Terms</option>
                        <option value={4}>4 Months</option>
                        <option value={8}>8 Months</option>
                        <option value={12}>12 Months</option>
                    </select>
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="LicFrequency" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    ZINARA Term
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="LicFrequency"
                        name="LicFrequency"
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        onChange={handleChange}
                        value={policyData["LicFrequency"] || ""}
                        disabled={!zinaraActive}
                    >
                        <option className="font-bold italic text-indigo-600">Select Number of Terms</option>
                        <option value={1}>4 Months</option>
                        <option value={6}>8 Months</option>
                        <option value={3}>12 Months</option>
                    </select>
                </div>
                <div className="flex items-center ml-4 w-28">
                    <input
                        id="zinara"
                        name="zinara"
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600"
                        checked={zinaraActive}
                        onChange={handleZinara}
                    />
                    <label htmlFor="zinara" className="ml-2 text-gray-900">
                        Zinara
                    </label>
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    ZBC Category
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="RadioTVUsage"
                        name="RadioTVUsage"
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        onChange={handleChange}
                        value={policyData["RadioTVUsage"] || ""}
                        disabled={!zbcActive}
                    >
                        <option className="font-bold italic text-indigo-600">Select Radio Usage</option>
                        <option value="1">Private Vehicle</option>
                        <option value="2">Company Vehicle</option>
                        <option value="3">Vehicle With TV</option>
                    </select>
                </div>
                <div className="flex items-center ml-4 w-28">
                    <input
                        id="zbc"
                        name="zbc"
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600"
                        checked={zbcActive}
                        onChange={handleZbc}
                    />
                    <label htmlFor="zbc" className="ml-2 text-gray-900">
                        ZBC
                    </label>
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="zbcTerm" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    ZBC Term
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="RadioTVFrequency"
                        name="RadioTVFrequency"
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        onChange={handleChange}
                        value={policyData["RadioTVFrequency"] || ""}
                        disabled={!zbcActive}
                    >
                        <option className="font-bold italic text-indigo-600">Select Term</option>
                        <option value={1}>4 Months</option>
                        <option value={2}>6 Months</option>
                        <option value={6}>8 Months</option>
                        <option value={3}>12 Months</option>
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
                            checked={policyData.currency === 'USD'}
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
                            checked={policyData.currency === 'ZWG'}
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

