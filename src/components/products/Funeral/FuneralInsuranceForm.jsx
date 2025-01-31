import React, { useEffect, useState } from 'react'
import PageLoading from '../../loadingStates/PageLoading';
import useAuth from '../../../hooks/useAuth';
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi';
import WatermarkedFormContainer from '../WatermarkedFormContainer';

export default function FuneralInsuranceForm() {

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
        // Validate required fields
        if (!policyData.insurerId && !user.companyId) {
            console.error("Insurer ID is required.");
            return; // Exit the function if validation fails
        }
    
        if (!policyData.planName || policyData.planName.trim() === "") {
            console.error("Plan Name is required.");
            return; // Exit the function if validation fails
        }
    
        if (!policyData.periodRange || policyData.periodRange <= 0) {
            console.error("Max Days Limit must be a valid number greater than 0.");
            return; // Exit the function if validation fails
        }
    
        if (!policyData.amount || policyData.amount <= 0) {
            console.error("Amount must be a valid number greater than 0.");
            return; // Exit the function if validation fails
        }
    
        if (!policyData.continent || policyData.continent.trim() === "") {
            console.error("Continent is required.");
            return; // Exit the function if validation fails
        }

        else if(policyData.continent!==""&&policyData.continent.trim()!==""&&policyData.periodRange!==""&&policyData.amount!==""&&policyData.planName!==""){
            setLoading(true)
            try{
                const postData = {
                    ...policyData,
                    insurerId: policyData.insurerId || user.companyId
                };
                const response = await InsuranceApi.post(`/travel-special-plan`,postData)
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
        }
    };

    return (
        <>
            {/* <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1"> */}
            <WatermarkedFormContainer>
                {
                    loading && <PageLoading loading={loading} failed={failed} success={success} /> 
                } 
                <h2 className="text-lg font-semibold">Insurance Creation Form</h2>
                <p className="text-xs mb-4">For Funeral Cover processing</p>
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
                            Policy Name
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "planName") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <select
                                name="planName"
                                id="planName"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                onChange={handleChange}
                                value={policyData["planName"] || ""}
                            >
                                <option value="Option 0">Plan Name</option>
                                <option value="NORMAL">Normal</option>
                                <option value="STUDENT">Student</option>
                                <option value="CORPORATE">Corporate</option>
                            </select>
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Max Days Limit
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "periodRange") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="periodRange"
                                id="periodRange"
                                autoComplete="family-name"
                                placeholder='Maximum Days Limit'
                                value={policyData["periodRange"] || ""}
                                onChange={handleChange}
                                className="block w-full rounded-xs bg-transparent border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Amount
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "amount") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="amount"
                                id="amount"
                                autoComplete="family-name"
                                placeholder='Amount'
                                value={policyData["amount"] || ""}
                                onChange={handleChange}
                                className="block w-full rounded-xs bg-transparent border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Continent
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
                                id="continent"
                                name="continent"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                onChange={handleChange}
                                value={policyData["continent"]||""}
                            >
                                <option value="Option 0">Continent</option>
                                <option value="AFRICA">Africa</option>
                                <option value="EUROPE">Europe</option>
                            </select>
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
                                    <option value="Option 0">Insurance Company</option>
                                    {
                                        insurers?insurers.map((insurer, index)=>(
                                            <option key={index} value={insurer.insurerId}>{insurer.insurerName}</option>
                                        )):<option value="Option 0">No data found</option>
                                    }
                                </select>
                            </div>
                        </div>
                    }
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
