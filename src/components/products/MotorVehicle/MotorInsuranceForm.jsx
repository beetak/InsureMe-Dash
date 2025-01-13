import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import PageLoading from '../../loadingStates/PageLoading';
import { postVehicleInsurance } from '../../../store/vehicle-store';
import useAuth from '../../../hooks/useAuth';
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi';
import WatermarkedFormContainer from '../WatermarkedFormContainer';

export default function MotorInsuranceForm() {

    const {user, setUser} = useAuth()
    const {role, accessToken, companyId} = user
    const userRole = role

    const [insurancePrice, setInsurancePrice] = useState("");
    const [insuranceTerm, setInsuranceTerm] = useState("");
    const [policyType, setPolicyType] = useState("");
    const [insurers, setInsurers] = useState("")
    const [policies, setPolicies] = useState("")
    const [insurerId, setInsurerId] = useState("");
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [addOnSuccess, setAddOnSuccess] = useState(1)
    const [error, setError] = useState([])

    useEffect(()=>{
        setupInterceptors(() => user, setUser);
        fetchPolicy()
        fetchInsurer()
    },[])

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
  
    const fetchInsurer = async () => {
        try{
            const response = await InsuranceApi.get(`/insurers`)
            if(response){
                console.log(response)
                setInsurers(response.data.data)
            }
        }
        catch(err){
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(companyId!==""){
            setInsurerId(companyId)
        }
        if(policyType===""&&insurancePrice===""&&insurerId===""){
            const newError = { err: 'empty', message: 'Please provide all fields' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
        }
        else {
            if(insurancePrice===""){
                const newError = { err: 'price', message: 'Please provide the price' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            else if(policyType!==""&&insurerId!==""&&insurancePrice!==""){
                setLoading(true)
                const postData = {
                    policeType: policyType,
                    insurerId,
                    insuranceTerm,
                    insurancePrice,
                    isActive: true
                }
                const response = await InsuranceApi.post(`/vehicle-insurance`,postData)
                console.log("post results: ", response)
                if(response.data.httpStatus==="CREATED"){
                    setSuccess(true)
                }
                else{
                    setFailed(true)
                }
                setTimeout(()=>{
                    setLoading(false)
                    setFailed(false)
                    setSuccess(false)
                    setPolicyType('')
                    setPrice('')
                    setProductDescription('')
                    setProductCategoryId(0)
                    setAddOnSuccess(1)
                }, 2000)
            }
        }
    }

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
                    <div className="sm:col-span-3 flex items-center">
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
                                        <option key={index} onClick={(e)=>setPolicyType(policy.policyTypeName)}>{policy.policyTypeName}</option>
                                    )):<option value="Option 0">No data found</option>
                                }
                            </select>
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Policy Term
                        </label>
                        <div className="mt-2 flex-1">
                            {/* {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "product") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            } */}
                            <select
                                id="insuranceTerm"
                                name="insuranceTerm"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value="">Select Policy</option>
                                <option onClick={()=>setInsuranceTerm(1)}>1</option>
                                <option onClick={()=>setInsuranceTerm(2)}>2</option>
                                <option onClick={()=>setInsuranceTerm(3)}>3</option>
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
                                >
                                    <option value="Option 0">Insurance Company</option>
                                    {
                                        insurers?insurers.map((insurer, index)=>(
                                            <option key={index} onClick={(e)=>setInsurerId(insurer.insurerId)}>{insurer.insurerName}</option>
                                        )):<option value="Option 0">No data found</option>
                                    }
                                </select>
                            </div>
                        </div>
                    }
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Price
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "price") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="insurancePrice"
                                id="insurancePrice"
                                autoComplete="family-name"
                                placeholder='Price'
                                value={insurancePrice}
                                onChange={(e)=>setInsurancePrice(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 bg-transparent ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
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
