import React, { useEffect, useState } from 'react'
import PageLoading from '../../loadingStates/PageLoading';
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi';
import useAuth from '../../../hooks/useAuth';
import WatermarkedFormContainer from '../WatermarkedFormContainer';

export default function PropertyInsuranceForm() {

    const {user, setUser} = useAuth()
    const userRole = user.role

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState([])
    const [policyData, setPolicyData] = useState([])
    const [insurers, setInsurers] = useState("")

    useEffect(()=>{
        fetchInsurer()
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
            console.error("Policy Description is required.");
            return; 
        }
    
        if (!policyData.policy || policyData.policy.trim() === "") {
            console.error("Policy is required.");
            return; 
        }

        if (!policyData.policyType || policyData.policyType.trim() === "") {
            console.error("Policy Type is required.");
            return; 
        }
    
        if (!policyData.rate || policyData.rate <= 0) {
            console.error("Policy Premium rate is required.");
            return; 
        }

        setLoading(true)
        try{
            const postData = {
                ...policyData,
                insurerId: policyData.insurerId || user.companyId
            };
            const response = await InsuranceApi.post(`/insurer-property-rates`, postData)
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

    return (
        <>
            <WatermarkedFormContainer>
                {
                    loading && <PageLoading loading={loading} failed={failed} success={success} /> 
                } 
                <h2 className="text-lg font-semibold">Insurance Creation Form</h2>
                <p className="text-xs mb-4">For Property Insurance processing</p>
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

                    {/* Roof Type */}
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Policy
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
                                id="policy"
                                name="policy"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                onChange={handleChange}
                                value={policyData["policy"] || ""}
                            >
                                <option className='font-bold italic text-gray-400'>Policy</option>
                                <option value="DOMESTIC_COMBINED_STANDARD_CONSTRUCTION">Domestic Combined Standard Construction</option>
                                <option value="DOMESTIC_COMBINED_NON_STANDARD_CONSTRUCTION">Domestic Combined non Standard Construction</option>
                            </select>
                        </div>
                    </div>

                    {/* Roof Type */}
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Policy Type
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
                                id="policyType"
                                name="policyType"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                onChange={handleChange}
                                value={policyData["policyType"] || ""}
                            >
                                <option className='font-bold italic text-gray-400'>Policy Type</option>
                                <option value="HOUSE_OWNERS">House Owners</option>
                                <option value="HOUSE_HOLDERS">House Holders</option>
                                <option value="ALL_RISK">All Risk</option>
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
                                name="rate"
                                id="rate"
                                autoComplete="family-name"
                                placeholder='Rate'
                                value={policyData["rate"] || ""}
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
