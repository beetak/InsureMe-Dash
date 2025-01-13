import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageLoading from '../../loadingStates/PageLoading';
import { fetchAsyncInsurer, getInsurers } from '../../../store/insurer-store';
import { fetchAsyncPolicy, getPolicies } from '../../../store/policy-store';
import { postPropertyPolicy } from '../../../store/property-store';
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi';
import useAuth from '../../../hooks/useAuth';
import WatermarkedFormContainer from '../WatermarkedFormContainer';

export default function PropertyInsuranceForm() {

    const dispatch = useDispatch()

    const {user, setUser} = useAuth()
    const userRole = user.role

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState([])
    const [policyData, setPolicyData] = useState([])
    const [insurers, setInsurers] = useState("")
    const [policies, setPolicies] = useState("")

    useEffect(()=>{
        fetchInsurer()
        fetchPolicy()
        setupInterceptors(() => user, setUser);
    },[])

    const fetchInsurer = async () => {
        try{
            const response = await InsuranceApi.get(`/insurers`)
            if(response){
                setInsurers(response.data.data)
            }
        }
        catch(err){
            console.log(error)
        }
    }

    const fetchPolicy = async () => {
        try{
            const response = await InsuranceApi.get(`/policy-types`)
            if(response&&response.data){
                console.log(response)
                setPolicies(response.data.data)
            }
        }
        catch(err){
            console.log(error)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setPolicyData({...policyData, [name] : value})
    }

    const handleSubmit = async() => {

        if (!policyData.insurerId && !user.companyId) {
            console.error("Insurer ID is required.");
            return; 
        }
    
        if (!policyData.description || policyData.description.trim() === "") {
            console.error("Plan Name is required.");
            return; 
        }
    
        if (!policyData.buildingType || policyData.buildingType.trim() === "") {
            console.error("Max Days Limit must be a valid number greater than 0.");
            return; 
        }
    
        if (!policyData.premiumPercentage || policyData.premiumPercentage <= 0) {
            console.error("Amount must be a valid number greater than 0.");
            return; 
        }

        setLoading(true)
        try{
            const postData = {
                ...policyData,
                insurerId: policyData.insurerId || user.companyId,
                active: true
            };
            const response = await InsuranceApi.post(`/property-insurance`,postData)
            console.log("post results: ", response)
            if(response.data.code==="CREATED"){
                setSuccess(true)
            }
            else{
                setFailed(true)
            }
        }
        catch(err){
            setFailed(true)
        }
        finally{
            setTimeout(()=>{
                setLoading(false)
                setFailed(false)
                setSuccess(false)
            }, 2000)
        }
    };


    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(1)
    
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

    const handleInputChange = (e, index) => {
        const updatedRows = [...rows];
        updatedRows[index] = e.target.value;
        setRows(updatedRows);
        console.log("rows ", rows)
    };

    return (
        <>
            <WatermarkedFormContainer>
                {
                    loading && <PageLoading loading={loading} failed={failed} success={success} /> 
                } 
                <h2 className="text-lg font-semibold">Insurance Creation Form</h2>
                <p className="text-xs mb-4">For vehicle Insurance processing</p>
                <div className='space-y-1'>
                    {
                        Object.keys(error).length>0&&
                        error.map((error, index) => {
                            if (error.err === "empty") {
                                return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                            }
                            return null;
                        })
                    }
                    {/* <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Policy Type
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "policy") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <select
                                id="insuranceType"
                                name="insuranceType"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value="Option 0">Select Policy Type</option>
                                {
                                    policies?policies.map((policy, index)=>(
                                        <option key={index} onClick={(e)=>setPolicyTypeId(policy.policyTypeId)}>{policy.policyTypeName}</option>
                                    )):<option value="Option 0">No data found</option>
                                }
                            </select>
                        </div>
                    </div> */}
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Description
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "description") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="description"
                                id="description"
                                autoComplete="family-name"
                                placeholder='Description'
                                value={policyData["description"] || ""}
                                onChange={handleChange}
                                className="block w-full rounded-xs bg-transparent border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    {
                        userRole === "ADMIN" && 
                        <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                                Insurance Company
                            </label>
                            <div className="mt-2 flex-1">
                                {
                                    Object.keys(error).length>0&&
                                    error.map((error, index) => {
                                        if (error.err === "insurer") {
                                            return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                        }
                                        return null;
                                    })
                                }
                                <select
                                    id="insurerId"
                                    name="insurerId"
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                    onChange={handleChange}
                                >
                                    <option value="Option 0" className='text-gray-400'>Insurance Company</option>
                                    {
                                        insurers?insurers.map((insurer, index)=>(
                                            <option key={index} value={insurer.insurerId}>{insurer.insurerName}</option>
                                        )):<option value="Option 0">No data found</option>
                                    }
                                </select>
                            </div>
                        </div>
                    }
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Building Type
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "insurer") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <select
                                id="buildingType"
                                name="buildingType"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                onChange={handleChange}
                            >
                                <option value="Option 0" className='text-gray-400'>Building Type</option>
                                <option value="THATCH">Thatched</option>
                                <option value="NON_THATCH">Non Thatched</option>
                            </select>
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Premium %
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "description") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="premiumPercentage"
                                id="premiumPercentage"
                                autoComplete="family-name"
                                placeholder='Description'
                                value={policyData["premiumPercentage"] || ""}
                                onChange={handleChange}
                                className="block w-full rounded-xs bg-transparent border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>               
                </div>
                <div className='flex space-x-2 pt-10'>
                    <button
                        onClick={handleSubmit}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-main-color text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                        Submit
                    </button>
                    <button
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-secondary-color text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                        Cancel
                    </button>
                </div>
            </WatermarkedFormContainer>
        </>
    )
}
