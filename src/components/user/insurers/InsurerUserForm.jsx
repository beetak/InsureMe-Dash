import React, { useEffect, useState } from 'react'
import PageLoading from '../../loadingStates/PageLoading';
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi';
import useAuth from '../../../hooks/useAuth';

export default function InsurerUserForm() {

    const {user, setUser} = useAuth()
    const userRole = user.role

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [insurerId, setInsurerId] = useState(0);
    const [title, setTitle] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState([])
    const [insurers, setInsurers] = useState('')

    useEffect(()=>{
        fetchInsurer()
        setupInterceptors(() => user, setUser);
    },[])
    
    const fetchInsurer = async () => {
        setLoading(true)
        try{
          const response = await InsuranceApi.get('/insurers')
          if(response){
            console.log(response)
            setInsurers(response.data.data)
          }
        }
        catch(err){
            console.log(error)
        }
        finally{
          setLoading(false)
        }
    }

    const handlePost = async (e) => {
        e.preventDefault()
        if(user.companyId){
            setInsurerId(user.companyId)
        }
        if(firstName===""&&lastName===""&&email===""&&phoneNumber===""&&title===""&&insurerId===0){
            const newError = { err: 'empty', message: 'Please provide all fields' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
        }
        else {
            if(firstName===""){
                const newError = { err: 'firstname', message: 'Please provide user First Name(s)' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(lastName===""){
                const newError = { err: 'lastname', message: 'Please provide user Surname' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(email===""){
                const newError = { err: 'email', message: 'Please provide user email' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(title===""){
                const newError = { err: 'title', message: 'Please provide user job title' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(phoneNumber===""){
                const newError = { err: 'phone', message: 'Please provide user phone number' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(insurerId===0){
                const newError = { err: 'insurer', message: 'Please select the parent insurer' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            else if(firstName!==""&&lastName!==""&&email!==""&&phoneNumber!==""&&title!==""&&insurerId!==0){
                setLoading(true)
                try{
                    const postData = {
                        insurerId,
                        insurerUser: {
                            firstName,
                            lastName,
                            email,
                            phoneNumber,
                            password: "string",
                            title,
                            role
                        }
                    }
                    const response = await InsuranceApi.post(`/insurer-users/signup`,postData)
                    console.log("post results: ", response)
                    if(response.data.code==="CREATED"){
                        setSuccess(true)
                    }
                    else{
                        setFailed(true)
                    }
                }
                catch(err){

                }
                finally{
                    setTimeout(()=>{
                        setLoading(false)
                        setFailed(false)
                        setSuccess(false)
                        setFirstName('')
                        setLastName('')
                        setEmail('')
                        setPhoneNumber('')
                        setTitle('')
                    }, 2000)
                }
            }
        }
    }

    const roles = [ 
        "INSURER_ADMIN", 
        "SALES_AGENT" 
    ]

    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                {
                    loading && <PageLoading loading={loading} failed={failed} success={success}/> 
                } 
                <h2 className="text-lg font-semibold">Insurer Admin User Creation Form</h2>
                <p className="text-xs mb-4">User responsible for Insurance Company Policies</p>
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
                            Firstname(s)
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "firstname") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            autoComplete="family-name"
                            placeholder='First Name'
                            value={firstName}
                            onChange={(e)=>setFirstName(e.target.value)}
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Lastname
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "lastname") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            autoComplete="family-name"
                            placeholder='Surname'
                            value={lastName}
                            onChange={(e)=>setLastName(e.target.value)}
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Job Title
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "title") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="title"
                                id="title"
                                autoComplete="family-name"
                                placeholder='Job Title'
                                value={title}
                                onChange={(e)=>setTitle(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Email Address
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "email") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="adon"
                                id="adon"
                                autoComplete="family-name"
                                placeholder='Email Address'
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
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
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option 
                                    className='font-bold italic'
                                >Select User Role</option>
                                {
                                    roles.map((role, index)=>(
                                        <option key={index} onClick={(e)=>setRole(role)}>{role}</option>
                                    ))
                                }
                                
                            </select>
                        </div>
                    </div>
                    {
                        userRole !== 'INSURER_ADMIN' && 
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
                                    <option value="Option 0">Select Insurance Company</option>
                                    {
                                        insurers?insurers.map((insurer, index)=>(
                                            <option key={index} onClick={(e)=>setInsurerId(insurer.insurerId)}>{insurer.insurerName}</option>
                                        )):<option value="Option 0">No data found</option>
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

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}