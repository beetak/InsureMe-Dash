import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { navActions } from '../../../store/nav-store'
import { fetchAsyncTowns, getTowns, postShop } from '../../../store/entity-store'
import PageLoading from '../../loadingStates/PageLoading'

export default function ShopForm() {

    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [townId, setTownId] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState([])
    const [townResponse, setTownResponse] = useState('')

    const towns = useSelector(getTowns)

    useEffect(()=>{
        dispatch(fetchAsyncTowns())
        .then((res)=>{
            console.log("search response ", res)
            setLoading(false)
            if(!res.payload.success){
                setTownResponse("Error fetching resource, Please check your network connection")
            }
            else if(res.payload.success&&!res.payload.data){
                setTownResponse("No Categories found")
            }
            }
        )
        .finally(()=>{
            setLoading(false)
        })
    },[dispatch])

    const handlePost = async (e) => {
        e.preventDefault()
        if(name===""&&phoneNumber===""&&address===""&&townId===0){
            const newError = { err: 'empty', message: 'Please provide all fields' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
        }
        else {
            if(name===""){
                const newError = { err: 'name', message: 'Please provide the shop name' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(phoneNumber===""){
                const newError = { err: 'phone', message: 'Please provide the shop name' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(address===""){
                const newError = { err: 'address', message: 'Please provide the shop name' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(townId===0){
                const newError = { err: 'town', message: 'Please select a town' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            else if(name!==""&&townId!==0){
                setLoading(true)
                dispatch(postShop({
                    townId,
                    shop: {
                        name,
                        phoneNumber,
                        address
                    }
                }))
                .then((response)=>{
                    console.log("Post response: ", response)
                    if(response.payload.success){
                        setSuccess(true)
                    }
                    else{
                        setFailed(true)
                    }
                })
                .finally(()=>{
                    setTimeout(()=>{
                        setLoading(false)
                        setSuccess(false)
                        setFailed(true)
                        setName("")
                    }, 2000)
                })
            }
        }
    }

    return (
        <>
            {
                loading && <PageLoading loading={loading} success={success} failed={failed}/>
            }
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                <h2 className="text-lg font-semibold">Shop Creation Form</h2>
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
                            Name
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "name") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="family-name"
                                placeholder='Shop Name'
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div> 
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Phone Number
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "phone") {
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
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Address
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "address") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="address"
                                id="address"
                                autoComplete="family-name"
                                placeholder='Shop Address'
                                value={address}
                                onChange={(e)=>setAddress(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div> 
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
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
                                <option value="Option 0">Select Parent Town</option>
                                {
                                    towns?towns.map((town, index)=>(
                                        <option key={index} onClick={(e)=>setTownId(town.id)}>{town.name}</option>
                                    )):<option value="Option 0">No data found</option>
                                }
                            </select>
                        </div>
                    </div>                   
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