import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageLoading from '../../loadingStates/PageLoading';
import { fetchAsyncInsurer, getInsurers } from '../../../store/insurer-store';
import { fetchAsyncPolicy, getPolicies } from '../../../store/policy-store';
import { fetchAsyncVehicleClasses, getVehicleClasses, postVehicleInsurance } from '../../../store/vehicle-store';
import { postAddOn } from '../../../store/addon-store';

const userRole = localStorage.getItem('role')
const companyId = localStorage.getItem('companyId')

export default function TravelInsuranceForm() {

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(fetchAsyncInsurer())
        .then((response)=>{
            
        })
        dispatch(fetchAsyncPolicy())
        .then((response)=>{

        })
        dispatch(fetchAsyncVehicleClasses())
        .then((response)=>{

        })
    },[])

    const policies = useSelector(getPolicies)
    const insurers = useSelector(getInsurers)
    const classes = useSelector(getVehicleClasses)

    const [description, setDescription] = useState("");
    const [insurancePrice, setInsurancePrice] = useState("");
    const [insuranceTerm, setInsuranceTerm] = useState("");
    const [policyTypeId, setPolicyTypeId] = useState("");
    const [vehicleClassId, setVehicleClassId] = useState("");
    const [insurerId, setInsurerId] = useState("");
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [addOnSuccess, setAddOnSuccess] = useState(1)
    const [error, setError] = useState([])
    const [policyData, setPolicyData] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target
        setPolicyData({...policyData, [name] : value})
    }

    const handleSubmit  = () => {
        
    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     if(companyId!==""){
    //         setInsurerId(companyId)
    //     }
    //     if(policyTypeId===""&&description===""&&insurancePrice===""&&insurerId===""&&vehicleClassId===""){
    //         const newError = { err: 'empty', message: 'Please provide all fields' };
    //             setError(prevError => [...prevError, newError]);
    //             setTimeout(() => {
    //                 setError(prevError => prevError.filter(error => error !== newError));
    //             }, 2000);
    //     }
    //     else {
    //         if(description===""){
    //             const newError = { err: 'description', message: 'Please provide the product description' };
    //             setError(prevError => [...prevError, newError]);
    //             setTimeout(() => {
    //                 setError(prevError => prevError.filter(error => error !== newError));
    //             }, 2000);
    //         }
    //         if(insurancePrice===""){
    //             const newError = { err: 'price', message: 'Please provide the price' };
    //             setError(prevError => [...prevError, newError]);
    //             setTimeout(() => {
    //                 setError(prevError => prevError.filter(error => error !== newError));
    //             }, 2000);
    //         }
    //         else if(policyTypeId!==""&&insurerId!==""&&vehicleClassId!==""&&description!==""&&insurancePrice!==""){
    //             setLoading(true)
    //             dispatch(postVehicleInsurance({                    
    //                 policyTypeId,
    //                 insurerId,
    //                 insuranceTerm,
    //                 vehicleClassId,
    //                 description,
    //                 insurancePrice,
    //                 isActive: true
    //             }))
    //             .then((response)=>{
    //                 if(response.payload&&response.payload.success){
    //                     setSuccess(true)                        
    //                 }
    //                 else{
    //                     setFailed(true)
    //                 }            
    //             })
    //             .finally(()=>{
    //                 setTimeout(()=>{
    //                     setLoading(false)
    //                     setFailed(false)
    //                     setSuccess(false)
    //                     setProductName('')
    //                     setPrice('')
    //                     setProductDescription('')
    //                     setProductCategoryId(0)
    //                     setAddOnSuccess(1)
    //                 },5000)
    //             })
    //         }
    //     }
    // }

    // const submitProductAddOns = ({description, productId}) => {
    //     dispatch(postAddOn({
    //         description,
    //         isActive: true,
    //         productId
    //     }))
    //     .then((response)=>{
    //         console.log("Post Add response: ", response.payload)
    //         if(response.payload&&response.payload.success){
    //             setAddOnSuccess(addOnSuccess + 1)
    //             console.log("new success value ", addOnSuccess)
    //         }
    //     })
    // }

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
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
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
                            <input
                                type="text"
                                name="planName"
                                id="planName"
                                autoComplete="family-name"
                                placeholder='Plan Name'
                                value={policyData["planName"] || ""}
                                onChange={handleChange}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
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
                                    if (error.err === "maxDaysLimit") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="maxDaysLimit"
                                id="maxDaysLimit"
                                autoComplete="family-name"
                                placeholder='Maximum Days Limit'
                                value={policyData["maxDaysLimit"] || ""}
                                onChange={handleChange}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
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
                                name="price"
                                id="price"
                                autoComplete="family-name"
                                placeholder='Price'
                                value={policyData["price"] || ""}
                                onChange={handleChange}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
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
                                <option value="Africa">Africa</option>
                                <option value="Africa">Europe</option>
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
                                            <option key={index} onClick={(e)=>setInsurerId(insurer.insurerId)}>{insurer.insurerName}</option>
                                        )):<option value="Option 0">No data found</option>
                                    }
                                </select>
                            </div>
                        </div>
                    }
                    {/* {[...Array(count)].map((_, index) => (
                        <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                                Travel Duration
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
                                    name="duration"
                                    id="duration"
                                    autoComplete="family-name"
                                    placeholder='Duration in days'
                                    value={description}
                                    onChange={(e)=>setDescription(e.target.value)}
                                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className='mx-2'>Days</div>
                            <div className="mt-2 ml-3 flex-1">
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
                                    name="amount"
                                    id="amount"
                                    autoComplete="family-name"
                                    placeholder='Amount'
                                    value={description}
                                    onChange={(e)=>setDescription(e.target.value)}
                                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                            {index === count - 1 ? 
                            (<span onClick={increment} className="fas fa-plus px-3" />):(<span onClick={() => decrement(index)} className="fas fa-minus px-3" />)}
                        </div>
                    ))}                     */}
                </div>
                <div className='flex space-x-2 pt-10'>
                    <button
                        onClick={handleSubmit}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Submit
                    </button>
                    <button
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Cancel
                    </button>
                </div>
            </div>
        </>
    )
}
