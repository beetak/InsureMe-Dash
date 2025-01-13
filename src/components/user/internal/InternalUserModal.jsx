import React, { useEffect, useState } from 'react'
import Modal from '../../modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAsyncRegions, fetchAsyncShops, fetchAsyncTowns, getRegions, getShops, getTowns } from '../../../store/entity-store';
import { postInsurer } from '../../../store/insurer-store';

export default function InternalUserModal(props) {

    const dispatch = useDispatch()
    const shops = useSelector(getShops)
    const towns = useSelector(getTowns)
    const regions = useSelector(getRegions)

    const [domainName, setDomainName] = useState("")
    const [role, setRole] = useState("")
    const [regionId, setRegionId] = useState("")
    const [townId, setTownId] = useState("")
    const [shopId, setShopId] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState([])
    const [shopResponse, setShopResponse] = useState('')
    const [townResponse, setTownResponse] = useState('')
    const [regionResponse, setRegionResponse] = useState('')
    const [message, setMessage] = useState('')

    useEffect(()=>{
        dispatch(fetchAsyncShops())
        .then((res)=>{
            console.log("search response ", res)
            setLoading(false)
            if(!res.payload.success){
                setShopResponse("Error fetching resource, Please check your network connection")
            }
            else if(res.payload.success&&!res.payload.data){
                setShopResponse("No Shops found")
            }
            }
        )
    },[dispatch])
    
    useEffect(()=>{
        dispatch(fetchAsyncTowns())
        .then((res)=>{
            console.log("search response ", res)
            setLoading(false)
            if(!res.payload.success){
                setTownResponse("Error fetching resource, Please check your network connection")
            }
            else if(res.payload.success&&!res.payload.data){
                setTownResponse("No Towns found")
            }
            }
        )
    },[dispatch])

    useEffect(()=>{
        dispatch(fetchAsyncRegions())
        .then((res)=>{
            console.log("search response ", res)
            setLoading(false)
            if(!res.payload.success){
                setRegionResponse("Error fetching resource, Please check your network connection")
            }
            else if(res.payload.success&&!res.payload.data){
                setRegionResponse("No Regions found")
            }
            }
        )
    },[dispatch])

    const [close, setClose] = useState(false)

    const handleUpdate = async (e) => {
        e.preventDefault()
        if(insurerName===""&&address===""&&officeNumber===""&&email===""){
            const newError = { err: 'empty', message: 'Please provide all fields' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
        }
        else {
            setLoading(true)
            dispatch(postInsurer({
                insurerName,
                insurerLogo: "string",
                address,
                secondAddress,
                mobileNumber,
                officeNumber,
                email,
                websiteUrl,
                isActive
            }))
            .then((response)=>{
                if(response.payload&&response.payload.success){
                    setSuccess(true)
                }
                else{
                    setFailed(true)
                }            
            })
            .finally(()=>{
                setTimeout(()=>{
                    setLoading(false)
                    setFailed(false)
                    setSuccess(false)
                    setInsurerName('')
                    setPrice('')
                    setProductDescription('')
                    setProductCategoryId(0)
                    setAddOnSuccess(1)
                },5000)
            })
        }
    }

    const roles = [ 
        "SUPER_ADMINISTRATOR", 
        "SALES_AGENT", 
        "SHOP_SUPERVISOR", 
        "BUSINESS_PERFORMANCE_SUPERVISOR", 
        "AREA_BUSINESS_MANAGER", 
        "REGIONAL_GENERAL_MANAGER", 
        "REGIONAL_ACCOUNTANT", 
        "FINANCE_MANAGER", 
        "ADMIN" 
    ]
    
    const getModal =(isOpen)=>{
        props.setModal(isOpen)
    }

    return (
        <>
            <Modal setModal={getModal}>
                <h2 className="text-lg font-semibold">Insurance Company Details Modification</h2>
                <p className="text-xs mb-4">Edit Fields</p>
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
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                        Domain Name
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "domain") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="domainName"
                                id="domainName"
                                autoComplete="family-name"
                                placeholder='Domain Name'
                                value={domainName}
                                onChange={(e)=>setDomainName(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                        User Role
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "role") {
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
                                <option 
                                    className='font-bold italic'
                                    onClick={()=>{
                                        setRole("")
                                        setRegionId("")
                                        setTownId("")
                                        setShopId("")
                                    }}
                                >Select User Role</option>
                                {
                                    roles.map((role, index)=>(
                                        <option key={index} onClick={(e)=>setRole(e.target.value)}>{role}</option>
                                    ))
                                }
                                
                            </select>
                        </div>
                    </div>
                    {
                        role && (role === "SALES_AGENT" || role === "AREA_BUSINESS_MANAGER" || role === "SHOP_SUPERVISOR" || role === "BUSINESS_PERFORMANCE_SUPERVISOR" || role === "REGIONAL_ACCOUNTANT" || role === "REGIONAL_GENERAL_MANAGER") &&
                        <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                                Region
                            </label>
                            <div className="mt-2 flex-1">
                                {
                                    Object.keys(error).length>0&&
                                    error.map((error, index) => {
                                        if (error.err === "region") {
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
                                    <option 
                                        className='font-bold italic'
                                        onClick={()=>{
                                            setRegionId("")
                                            setTownId("")
                                            setShopId("")
                                        }}
                                    >Select User Region</option>
                                    {
                                        regions.map((region, index)=>(
                                            <option key={index} onClick={(e)=>setRegionId(region.id)}>{region.name}</option>
                                        ))
                                    }
                                    
                                </select>
                            </div>
                        </div>
                    }
                    {
                        role && regionId && (role === "SALES_AGENT" || role === "AREA_BUSINESS_MANAGER" || role === "BUSINESS_PERFORMANCE_SUPERVISOR" || role === "SHOP_SUPERVISOR") &&
                        <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                                Town
                            </label>
                            <div className="mt-2 flex-1">
                                {
                                    Object.keys(error).length>0&&
                                    error.map((error, index) => {
                                        if (error.err === "town") {
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
                                    <option 
                                        className='font-bold italic'
                                        onClick={()=>{
                                            setTownId("")
                                            setShopId("")
                                        }}
                                    >Select User Town</option>
                                    {
                                        towns.map((town, index)=>(
                                            <option key={index} onClick={(e)=>setTownId(town.id)}>{town.name}</option>
                                        ))
                                    }
                                    
                                </select>
                            </div>
                        </div>
                    }
                    {
                        role && townId && (role === "SALES_AGENT" || role === "SHOP_SUPERVISOR") &&
                        <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                                Shop
                            </label>
                            <div className="mt-2 flex-1">
                                {
                                    Object.keys(error).length>0&&
                                    error.map((error, index) => {
                                        if (error.err === "shop") {
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
                                    <option 
                                        className='font-bold italic'
                                        onClick={()=>{
                                            setShopId("")
                                        }}
                                    >Select User Shop</option>
                                    {
                                        shops.map((shop, index)=>(
                                            <option key={index} onClick={(e)=>setShopId(shop.id)}>{shop.name}</option>
                                        ))
                                    }
                                    
                                </select>
                            </div>
                        </div>
                    }
                </div>
                <div className='flex space-x-2 pt-10'>
                    <button
                        onClick={handleUpdate}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Submit
                    </button>
                    <button
                        onClick={()=>props.setModal(close)}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Cancel
                    </button>
                </div>
            </Modal>
        </>
    )
}
