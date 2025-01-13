import React, { useEffect, useState } from 'react'
import { fetchAsyncPolicy, getPolicies } from '../../../store/policy-store'
import { useDispatch, useSelector } from 'react-redux'

export default function PolicyDetails({ onChange }) {

    const dispatch = useDispatch()

    const [vehicleClass, setVehicleClass] = useState("")
    const [zbcCategory, setZbcCategory] = useState("")
    const [zbcTerm, setZbcTerm] = useState("")
    const [zinaraTerm, setZinaraTerm] = useState("")
    const [insuranceType, setInsuranceType] = useState("")
    const [insuranceTerm, setInsuranceTerm] = useState("")
    const [activeTab, setActiveTab] = useState(1);
    const [zbcActive, setZbcActive] = useState(true);
    const [zinaraActive, setZinaraActive] = useState(true);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPolicyDetails((prevDetails) => ({
          ...prevDetails,
          [name]: value,
        }));
        onChange(policyDetails);
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setPolicyDetails((prevDetails) => ({
          ...prevDetails,
          [name]: checked,
        }));
    };

    const handleZbc = () =>{
        setZbcActive(!zbcActive)
    }
    const handleZinara = () =>{
        setZinaraActive(!zinaraActive)
    }

    const policies = useSelector(getPolicies)

    return (
        <>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    ZBC Category
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="zbcCategory"
                        name="zbcCategory"
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        onChange={handleChange}
                        value={policyDetails.zbcCategory}
                        disabled={zbcActive}
                    >
                        <option className="font-bold italic text-indigo-600">Select Category</option>
                        <option value="Private">Private</option>
                        <option value="Urban">Urban</option>
                    </select>
                </div>
                <div className="flex items-center ml-4">
                    <input
                        id="zbc"
                        name="zbc"
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600"
                        checked={!zbcActive}
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
                        id="zbcTerm"
                        name="zbcTerm"
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        onChange={handleChange}
                        value={policyDetails.zbcTerm}
                        disabled={zbcActive}
                    >
                        <option className="font-bold italic text-indigo-600">Select Number of Terms</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                    </select>
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="vehicleClass" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Vehicle Class
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="vehicleClass"
                        name="vehicleClass"
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        onChange={handleChange}
                        value={policyDetails.vehicleClass}
                    >
                        <option className="font-bold italic text-indigo-600">Select Class</option>
                        <option value="Up-1500">Up-1500</option>
                    </select>
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="zinaraTerm" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    ZINARA Term
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="zinaraTerm"
                        name="zinaraTerm"
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        onChange={handleChange}
                        value={policyDetails.zinaraTerm}
                        disabled={zinaraActive}
                    >
                        <option className="font-bold italic text-indigo-600">Select Number of Terms</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                    </select>
                </div>
                <div className="flex items-center ml-4">
                    <input
                        id="zinara"
                        name="zinara"
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600"
                        checked={!zinaraActive}
                        onChange={handleZinara}
                    />
                    <label htmlFor="zinara" className="ml-2 text-gray-900">
                        Zinara
                    </label>
                </div>
            </div>
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
                        value={policyDetails.insuranceType}
                    >
                    <option className='font-bold italic text-indigo-600'>Select Policy</option>
                    {
                        policies?policies.map((policy, index)=>(
                            <option key={index} value={policy.policyTypeName}>{policy.policyTypeName}</option>
                        )):<option >No data found</option>
                    }
                    </select>
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
                        value={policyDetails.insuranceTerm}
                    >
                        <option className='font-bold italic text-indigo-600'>Select Number of Terms</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                    </select>
                </div>
            </div>
        </>
    )
}

