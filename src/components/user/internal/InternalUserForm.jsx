import React, { useEffect, useState } from 'react'
import UserLoadingModal from './InternalUserLoadingModal'
import useAuth from '../../../hooks/useAuth'
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi'

export default function InternalUserForm() {

    const { user, setUser } = useAuth()

    useEffect(() => {
        setupInterceptors(() => user, setUser)
    },[])

    const [domainName, setDomainName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
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
    const [regions, setRegions] = useState('')
    const [towns, setTowns] = useState('')
    const [shops, setShops] = useState('')

    useEffect(()=>{
        const fetchAsyncRegions = async () => {
            try {
                const response = await InsuranceApi.get('/region')
                if(response.data.code==="OK"&&response.data.data.length>0){
                    setRegions(response.data.data)
                }
                else if (response.data.code==="OK"&&response.data.data.length<1){
                    setRegionResponse("No regions found")
                }
            } catch (error) {
                setRegionResponse('Error fetching regions')
                console.error("Error fetching regions: ", error)
            }
        }
        fetchAsyncRegions()
    },[])

    const fetchTowns = async (id) => {
        try{
            const response = await InsuranceApi.get(`/town/region/${id}`)
            if(response.data.code==="OK"&&response.data.data.length>0){
                setTowns(response.data.data)
            }
            else if (response.data.code==="OK"&&response.data.data.length<1){
                setTownResponse("No towns found for this region")
            }
        }
        catch(err){
            setTownResponse("Error fetching towns")
        }
        
    }
    
    const fetchShops = async (id) => {
        try{
            const response = await InsuranceApi.get(`/shop/town/${id}`)
            if(response.data.code==="OK"&&response.data.data.length>0){
                setShops(response.data.data)
            }
            else if (response.data.code==="NOT_FOUND"){
                setShopResponse("No shops found for this town")
            }
        }
        catch(err){
            setShopResponse("Error fetching towns")
        }
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
                const [firstname, lastname] = domainName.split('.');

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
                        try{
                            if(response){
                                const response = await InsuranceApi.post(`/auth/register`,{
                                    firstname,
                                    lastname,
                                    email: domainName,
                                    phoneNumber,
                                    role
                                })
                                if(response){
                                    try{
                                        const res = await InsuranceApi.post(`/user-region`,{
                                            userId: response.data.data.id,
                                            regionId
                                        })
                                        if(response.data.code==="CREATED"){
                                            setSuccess(true)
                                            setMessage({status: true, data: response.data.data, region: res.data.data.regionId,  code: 'User Creation Successful'});
                                        }
                                        else{
                                            setMessage({status: true, data: response.data.data, region: "", code: 'Region Assignment Failed'})
                                        }
                                    }
                                    catch(err){
                                        setMessage({status: true, data: response.data.data, region: "",  code: 'Region Assignment Failed'});
                                    }
                                }
                                else{
                                    
                                }
                            }
                            else{
                                setMessage({status: true, data: "", code: "User Creation Failed"});
                                setFailed(true)
                            }
                        }
                        catch(err){
                            setMessage({status: true, data: "", code: "User Creation Failed"});
                        }
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
                        
                        const response = await InsuranceApi.post(`/auth/register`,{
                            firstname,
                            lastname,
                            email: domainName,
                            phoneNumber,
                            role
                        })
                        if(response.data.code==="CREATED"){
                            try{
                                const res = await InsuranceApi.post(`/user-town`,{
                                    userId:response.data.data.id,
                                    townId
                                })
                                if(res.data.code==="CREATED"){
                                    setSuccess(true)
                                    setMessage({status: true, data: response.data.data, town: res.data.data.townId, code: 'User Creation Successful'});
                                }
                                else{
                                    setMessage({status: true, data: response.data.data, town: "", code: "Town Assignment Failed"})
                                }
                            }
                            catch(err){
                                setMessage({status: true, data: response.data.data, town: "", code: "Town Assignment Failed"});
                            }
                        }
                        else{
                            setFailed(true)
                            setMessage({status: true, data: "", code: "User Creation Failed"});
                        }
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
                        const response = await InsuranceApi.post(`/auth/register`,{
                            firstname,
                            lastname,
                            email: domainName,
                            phoneNumber,
                            role
                        })
                        if(response.data.code==="CREATED"){
                            try{
                                const res = await InsuranceApi.post(`/user-shop`,{
                                    userId:response.data.data.id,
                                    shopId
                                })
                                if(res.data.code==="CREATED"){
                                    setSuccess(true)
                                    setMessage({status: true, data: response.data, shop: res.data.data, code: 'User Creation Successful'});
                                }
                                else{
                                    setMessage({status: true, data: response.data.data, shop: "", code: "Shop Assignment Failed"})
                                }
                            }
                            catch(err){
                                setMessage({status: true, data: response.data.data, shop: "", code: "Shop Assignment Failed"});
                            }
                        }
                        else{
                            setFailed(true)
                            setMessage({status: true, data: "", code: "User Creation Failed"});
                        }
                    }
                }
                else{
                    setLoading(true)
                    setMessage({status: false, data: ""});
                    try{
                        const response = await InsuranceApi.post(`/auth/register`,{
                            firstname,
                            lastname,
                            email: domainName,
                            phoneNumber,
                            role
                        })
                        if (response.data.code==="CREATED") {
                            setSuccess(true);
                            setMessage({status: true, data: response.data.data, code: 'User Creation Successful'});
                        } else {
                            setFailed(true);
                            setMessage({status: true, data: "", code: 'User Creation Failed'});
                        }
                    }
                    catch(err){
                        setMessage({status: true, data: "", code: 'User Creation Failed'});
                    }
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
                            Username
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
                                placeholder='Username'
                                value={domainName}
                                onChange={(e)=>setDomainName(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                            Phone Number
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "phoneNumber") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="phoneNumber"
                                id="phoneNumber"
                                autoComplete="family-name"
                                placeholder='Phone Number'
                                value={phoneNumber}
                                onChange={(e)=>setPhoneNumber(e.target.value)}
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
                                id="role"
                                name="role"
                                value={role}
                                onChange={(e) => {setRole(e.target.value)}}
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value={0}>Select User Role</option>
                                {roles ? (
                                    roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                    ))
                                ) : (
                                    <option value={0} className='text-red-500'>Not Found</option>
                                )}
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
                                    value={regionId}
                                    onChange={(e) => {setRegionId(Number(e.target.value));fetchTowns(e.target.value)}}
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                >
                                    <option value={0}>Select Parent Region</option>
                                    {regions ? (
                                        regions.map((region) => (
                                        <option key={region.id} value={region.id}>
                                            {region.name}
                                        </option>
                                        ))
                                    ) : (
                                        <option value={0} className='text-red-500'>{regionResponse}</option>
                                    )}
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
                                    value={townId}
                                    onChange={(e) => {setTownId(Number(e.target.value));fetchShops(e.target.value)}}
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                >
                                    <option value={0}>Select User Town</option>
                                    {towns ? (
                                        towns.map((town) => (
                                        <option key={town.id} value={town.id}>
                                            {town.name}
                                        </option>
                                        ))
                                    ) : (
                                        <option value={0}>{townResponse}</option>
                                    )}
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
                                    value={shopId}
                                    onChange={(e) => {setShopId(Number(e.target.value));fetchAgents(e.target.value)}}
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                >
                                    <option value={0}>Select User Shop</option>
                                    {shops ? (
                                        shops.map((shop) => (
                                        <option key={shop.id} value={shop.id}>
                                            {shop.name}
                                        </option>
                                        ))
                                    ) : (
                                        <option value={0}>{shopResponse}</option>
                                    )}
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
