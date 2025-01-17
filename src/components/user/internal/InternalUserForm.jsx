import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postAdmin, postUserRegion, postUserShop, postUserTown } from '../../../store/user-store'
import PageLoading from '../../loadingStates/PageLoading'
import { fetchAsyncRegions, fetchAsyncShops, fetchAsyncTowns, fetchShopsByTownId, fetchTownsByRegionId, getRegions, getShops, getTowns } from '../../../store/entity-store'
import UserLoadingModal from './InternalUserLoadingModal'

export default function InternalUserForm() {

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
    const [message, setMessage] = useState([])

    useEffect(()=>{
        dispatch(fetchAsyncRegions())
        .then((res)=>{
            console.log("search region response ", res)
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

    const fetchTowns = (id) => {
        dispatch(fetchTownsByRegionId(id))
        .then((res)=>{
            console.log("search response ", res)
            if(!res.payload.success){
                setCatResponse("Error fetching resource, Please check your network connection")
            }
            else if(res.payload.success&&!res.payload.data){
                setCatResponse("No Categories found")
            }
            if(res.payload.success){
                setTownState(true)
            }
        })
    }
    
    const fetchShops = (id) => {
        dispatch(fetchShopsByTownId(id))
        .then((res)=>{
            console.log("search response ", res)
            if(!res.payload.success){
                setCatResponse("Error fetching resource, Please check your network connection")
            }
            else if(res.payload.success&&!res.payload.data){
                setCatResponse("No Categories found")
            }
            if(res.payload.success){
                setShopState(true)
            }
        })
    }

    const handlePost = async (e) => {
        e.preventDefault()
        if(domainName===""&&role===""){
            const newError = { err: 'empty', message: 'Please provide all fields' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
        }
        else {
            if(domainName===""){
                const newError = { err: 'domain', message: 'Please provide the domain name' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(role===""){
                const newError = { err: 'role', message: 'Please select a role' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            else if(domainName!==""&&role!==""){

                const regionValidRoles = ["REGIONAL_ACCOUNTANT", "REGIONAL_GENERAL_MANAGER"];
                const townValidRoles = ["AREA_BUSINESS_MANAGER", "BUSINESS_PERFORMANCE_SUPERVISOR"];
                const shopValidRoles = ["SALES_AGENT", "SHOP_SUPERVISOR"];

                if (regionValidRoles.includes(role)) {
                    console.log("regional User")
                    if(regionId===""){
                        const newError = { err: 'region', message: 'Please select a region' };
                        setError(prevError => [...prevError, newError]);
                        setTimeout(() => {
                            setError(prevError => prevError.filter(error => error !== newError));
                        }, 2000);
                    }
                    else{
                        setLoading(true)
                        setMessage({status: false, data: ''});
                        dispatch(postAdmin({
                            firstname: "Tawanda",
                            lastname: "Mpofu",
                            email: domainName,
                            role
                        }))
                        .then((response)=>{
                            if(response.payload.success){
                                dispatch(postUserRegion({
                                    userId: response.payload.data.id,
                                    regionId
                                }))
                                .then((res)=>{
                                    if(response.payload.success){
                                        setSuccess(true)
                                        setMessage({status: true, data: response.payload.data, region: res.payload.data.regionId});
                                    }
                                    else{
                                        setMessage({status: true, data: response.payload.data, region: "Region Assignment Failed"})
                                    }
                                })
                                .catch(()=>{
                                    setMessage({status: true, data: response.payload.data, region: "User Assignment Failed"});
                                })
                            }
                            else{
                                setFailed(true)
                            }
                        })
                        .catch(()=>{
                            setMessage({status: true, data: "User Creation Failed"});
                        })
                    }
                }
                else if(townValidRoles.includes(role)){
                    console.log("town user")
                    if(regionId===""){
                        const newError = { err: 'region', message: 'Please select a region' };
                        setError(prevError => [...prevError, newError]);
                        setTimeout(() => {
                            setError(prevError => prevError.filter(error => error !== newError));
                        }, 2000);
                    }
                    if(townId===""){
                        const newError = { err: 'town', message: 'Please select a shop' };
                        setError(prevError => [...prevError, newError]);
                        setTimeout(() => {
                            setError(prevError => prevError.filter(error => error !== newError));
                        }, 2000);
                    }
                    else if(regionId!==""&&townId!==""){
                        setLoading(true)
                        setMessage({status: false, data: ''});
                        dispatch(postAdmin({
                            firstname: "Tawanda",
                            lastname: "Mpofu",
                            email: domainName,
                            role
                        }))
                        .then((response)=>{
                            if(response.payload.success){
                                dispatch(postUserTown({
                                    userId:response.payload.data.id,
                                    townId
                                }))
                                .then((res)=>{
                                    if(res.payload.success){
                                        setSuccess(true)
                                        setMessage({status: true, data: response.payload.data, town: res.payload.data.townId});
                                    }
                                    else{
                                        setMessage({status: true, data: response.payload.data, town: "Assigning Town Failed"})
                                    }
                                })
                                .catch(()=>{
                                    setMessage({status: true, data: response.payload.data, town: "Town Assignment Failed"});
                                })
                            }
                            else{
                                setFailed(true)
                            }
                        })
                    }
                }
                else if(shopValidRoles.includes(role)){
                    console.log("shop user")
                    if(regionId===""){
                        const newError = { err: 'region', message: 'Please select a region' };
                        setError(prevError => [...prevError, newError]);
                        setTimeout(() => {
                            setError(prevError => prevError.filter(error => error !== newError));
                        }, 2000);
                    }
                    if(townId===""){
                        const newError = { err: 'town', message: 'Please select a town' };
                        setError(prevError => [...prevError, newError]);
                        setTimeout(() => {
                            setError(prevError => prevError.filter(error => error !== newError));
                        }, 2000);
                    }
                    if(shopId===""){
                        const newError = { err: 'shop', message: 'Please select a shop' };
                        setError(prevError => [...prevError, newError]);
                        setTimeout(() => {
                            setError(prevError => prevError.filter(error => error !== newError));
                        }, 2000);
                    }
                    else if(regionId!==""&&townId!==""){
                        setLoading(true)
                        setMessage("loading")
                        dispatch(postAdmin({
                            firstname: "Tawanda",
                            lastname: "Mpofu",
                            email: domainName,
                            role
                        }))
                        .then((response)=>{
                            if(response.payload.success){
                                console.log("user post data ", response)
                                dispatch(postUserShop({
                                    userId:response.payload.data.id,
                                    shopId
                                }))
                                .then((res)=>{
                                    if(res.payload.success){
                                        setSuccess(true)
                                        setMessage({status: true, data: response.payload, shop: res.payload.data});
                                    }
                                    else{
                                        setMessage({status: true, data: response.payload.data, shop: "Shop Assignment Failed"})
                                    }
                                })
                                .catch(()=>{
                                    setMessage({status: true, data: response.payload.data, shop: "Shop Assignment Failed"});
                                })
                            }
                            else{
                                setFailed(true)
                            }
                        })
                    }
                }
                else{
                    setLoading(true)
                    setMessage({status: false, data: ""});
                    dispatch(postAdmin({
                        firstname: "Tawanda",
                        lastname: "Mpofu",
                        email: domainName,
                        role
                    }))
                    .then((response) => {
                        if (response.payload.success) {
                            setSuccess(true);
                            setMessage({status: true, data: response.payload.data});
                        } else {
                            setFailed(true);
                        }
                    })
                    .catch(()=>{
                        setFailed(true)
                    })
                }
            }
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
        setLoading(isOpen)
        setMessage([])
    }

    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                {
                    loading && <UserLoadingModal setModal={getModal} loading={loading} failed={failed} success={success} message={message}/> 
                } 
                <h2 className="text-lg font-semibold">User Creation Form</h2>
                <p className="text-xs mb-4">These users have access to create system internal users</p>
                <div className='space-y-4'>
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
                                    id="regionId"
                                    name="regionId"
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                >
                                    <option className='w-full' onClick={()=>setRegionId("")} value="">Select User Region</option>
                                    {
                                        regions?regions.map((region, i)=>{
                                            return(
                                                <option key={i} value="" onClick={()=>{fetchTowns(region.id);setRegionId(region.id)}}>{region.name}</option>
                                            )
                                            
                                        }):<option className='text-red-500'>An ERROR occurred</option>
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
                                    id="townId"
                                    name="townId"
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                >
                                    <option value="" onClick={()=>setTownId("")}>Select User Town</option>
                                    {
                                        towns?towns.map((town, i)=>{
                                            return(
                                                <option key={i} value="" onClick={()=>{setTownId(town.id);fetchShops(town.id)}}>{town.name}</option>
                                            )
                                            
                                        }):<option className='text-red-500'>An ERROR occurred</option>
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
                                    id="shopId"
                                    name="shopId"
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                >
                                    <option value="" onClick={()=>setShopId("")}>Select User Shop</option>
                                    {
                                        shops?shops.map((shop, i)=>{
                                            return(
                                                <option key={i} value="" onClick={()=>{setShopId(shop.id);fetchAgents(shop.id)}}>{shop.name}</option>
                                            )
                                            
                                        }):<option className='text-red-500'>An ERROR occurred</option>
                                    }
                                </select>
                            </div>
                        </div>
                    }
                </div>
                <div className='flex space-x-2 pt-10'>
                    <button
                    onClick={handlePost}
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
