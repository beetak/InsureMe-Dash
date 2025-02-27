import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SalesCharts from './SalesCharts'
import useAuth from '../../hooks/useAuth'
import InsuranceApi, { setupInterceptors } from '../api/InsuranceApi'

const shopName = localStorage.getItem('shopName')
const townName = localStorage.getItem('towmName')
const regionName = localStorage.getItem('regionName')
const userRole = localStorage.getItem('role')

export default function DashboardTop() {

    const { user, setUser } = useAuth()

    const [newClients, setNewClients] = useState('')
    const [totalPolicies, setTotalPolicies] = useState('')
    const [totalInsurers, setTotalInsurers] = useState('')
    const [userData, setUserData] = useState('')

    useEffect(() => {
        setupInterceptors(() => user, setUser)
        getNewUsers()
        // getTotalPolicies()
        getActiveCategories()   
        getTotalInsurers()
        getUser()
    },[])

    const getUser = async () => {
        const response = await InsuranceApi.get(`/users/userId/${user.userId}`)
        if(response.data.code==="OK"){
            setUserData(response.data.data)
        }
    }

    const getNewUsers = async () => {
        const response = await InsuranceApi.get(`/clients/count/current-day`)
        if(response.data.code==="OK"){
            setNewClients(response.data.data)
        }
    }

    // const getTotalPolicies = async () => {
    //     try{
    //         const response = await InsuranceApi.get(`/policy-types`)
    //         if(response&&response.data.httpStatus==="OK"){
    //           console.log("my response ", response)
    //           if(response.data.data.length<1){
    //             setTotalPolicies(0)
    //           }
    //           else{
    //             setTotalPolicies(response.data.data.length)
    //           }
    //       }
    //     }
    //     catch(err){
    //         console.log(error)
    //     }
    // }

    const getActiveCategories = async () => {
        try{
            const response = await InsuranceApi.get(`/categories`)
            if(response&&response.data.httpStatus==="OK"){
                console.log("my response ", response)
                if(response.data.data.length<1){
                    setTotalPolicies(0)
                }
                else{
                    setTotalPolicies(response.data.data.length)
                }
            }
        }
        catch(err){
            console.log(error)
        }
    }

    const getTotalInsurers = async () => {
        try{
            const response = await InsuranceApi.get('/insurers')
            if(response&&response.data.httpStatus==="OK"){
              console.log("my response ", response)
              if(response.data.data.length<1){
                setTotalInsurers(0)
              }
              else{
                setTotalInsurers(response.data.data.length)
              }
          }
        }
        catch(err){
            console.log(error)
        }
    }

    const navigate = useNavigate()

    const navigateToInsurers = () => {
        navigate('/insurers?insurerTab=true');
    };

    const navigateToUsers = () => {
        navigate('/customers?userTab=true');
    };

    const navigateToPolicies = () => {
        navigate('/insurance-type?insuranceTab=true');
    };

    const navigateToQuotes = () => {
        navigate('/insurers?insurerTab=true');
    };

    return (
        <>
            <div className="flex w-full space-x-3">
                <div className="flex flex-1">
                    <div className="flex-col flex w-full">
                        <div className="flex justify-around bg-gradient-to-r from-[#656E70] to-[#3B82F6] w-full rounded-md h-40 items-center">
                            <div className="flex flex-col p-4 space-y-4">
                                <h1 className='text-white text-sm font-bold'>
                                    <span className='fas fa-building mr-2'/>Total Insurers
                                </h1>
                                <h1 className='text-4xl font-bold text-white'>{totalInsurers||0}</h1>
                                <button 
                                    className="rounded-full border border-white text-white py-1 px-4"
                                    onClick={navigateToInsurers}
                                >
                                    view insurers
                                </button>
                            </div>
                            <div className="w-[1px] bg-white h-16 m-0 bg-gradient-to-b from-[#656E70] to-[rgba(255,255,255,1)]"/>
                            <div className="flex flex-col p-4 space-y-4">
                                <h1 className='text-white text-sm font-bold'>
                                    <span className='fas fa-user-plus mr-2'/>New Customers
                                </h1>
                                <h1 className='text-4xl font-bold text-white'>{newClients||0}</h1>
                                <button 
                                    className="rounded-full border border-white text-white py-1 px-4"
                                    onClick={navigateToUsers}
                                >
                                    view users 
                                </button>
                            </div>
                            <div className="w-[1px] bg-white h-16 m-0 bg-gradient-to-b from-[#656E70] to-[rgba(255,255,255,1)]"/>
                            <div className="flex flex-col p-4 space-y-4">
                                <h1 className='text-white text-sm font-bold'>
                                    <span className='fas fa-file-alt mr-2'/>Active Policy Category
                                </h1>
                                <h1 className='text-4xl font-bold text-white'>{totalPolicies||0}</h1>
                                <button 
                                    className="rounded-full border border-white text-white py-1 px-4"
                                    onClick={navigateToPolicies}
                                >
                                    view categories
                                </button>
                            </div>
                            {/* <div className="w-[1px] bg-white h-16 m-0 bg-gradient-to-b from-[#656E70] to-[rgba(255,255,255,1)]"/>
                            <div className="flex flex-col p-4 space-y-4">
                                <h1 className='text-white text-sm font-bold'>
                                    <span className='fas fa-comment-dollar mr-2'/>Quotes Generated
                                </h1>
                                <h1 className='text-4xl font-bold text-white'>125</h1>
                                <button className="rounded-full border border-white text-white py-1 px-4">
                                    view quotes
                                </button>
                            </div> */}
                        </div>
                        <SalesCharts/>
                    </div>
                </div>
                <div className="flex w-80">
                    <div className="flex flex-col p-2 space-y-2 items-center bg-gray-400 w-full rounded-md">
                        <div className="rounded-full overflow-hidden mt-8 h-36 w-36">
                            <img src={userData.userLogo?userData.userLogo:"images/user.png"} className='w-96 bg-gradient-to-b from-main-color to-secondary-color' alt="" />
                        </div>
                        <h1 className='text-white text-xl'>Fidelis Gwokuda</h1>
                        <h1  className='text-xs text-bold text-white' >{userRole}</h1>
                        <h1  className='text-xs text-bold text-white' >
                            {
                                shopName?<span>{shopName} Shop</span>:
                                townName?<span>{townName} Shop</span>:
                                regionName?<span>{regionName} Shop</span>:"TelOne Pivate Limited"
                            }
                        </h1>
                        {/* <div className="flex flex-col w-full rounded-md space-y-2 bg-white p-2">
                            <div className="flex rounded-md justify-around items-center bg-gray-400 text-white py-1">
                                <div className='rounded-full w-8 h-8 bg-gray-500 text-white flex justify-center items-center'>
                                    <i className='fas fa-check-square'/>
                                </div>
                                <div className="flex-col">
                                    <h1>todo-1</h1>
                                    <p className='text-xs'>Lorem, ipsum.</p>
                                </div>
                                <i className='fas fa-ellipsis-v'></i>
                            </div>
                            <div className="flex rounded-md justify-around items-center bg-gray-400 text-white py-1">
                                <div className='rounded-full w-8 h-8 bg-gray-500 text-white flex justify-center items-center'>
                                    <i className='fas fa-check-square'/>
                                </div>
                                <div className="flex-col">
                                    <h1>todo-1</h1>
                                    <p className='text-xs'>Lorem, ipsum.</p>
                                </div>
                                <i className='fas fa-ellipsis-v'></i>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}
