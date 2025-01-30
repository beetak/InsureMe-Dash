import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SalesCharts from './SalesCharts'

const shopName = localStorage.getItem('shopName')
const shopId = localStorage.getItem('shopId')
const townName = localStorage.getItem('towmName')
const townId = localStorage.getItem('towmId')
const regionName = localStorage.getItem('regionName')
const regionId = localStorage.getItem('regionId')
const userRole = localStorage.getItem('role')

export default function DashboardTop() {

    const navigate = useNavigate()

    const handleNavigate = () => {
        navigate('/insurers?insurerTab=true');
    };

    return (
        <>
            <div className="flex w-full space-x-3">
                <div className="flex flex-1 bg-white">
                    <div className="flex-col flex w-full">
                        <div className="flex justify-around bg-gradient-to-r from-[#656E70] to-[#3B82F6] w-full rounded-md h-40 items-center">
                            <div className="flex flex-col p-4 space-y-4">
                                <h1 className='text-white text-sm font-bold'><span className='fas fa-user mr-2'/>Total Insurers</h1>
                                <h1  className='text-4xl text-bold text-white' >12</h1>
                                <button 
                                    className="rounded-full border border-white text-white py-1 px-4"
                                    onClick={handleNavigate}
                                >
                                    view insurers
                                </button>
                            </div>
                            <div className="w-[1px] bg-white h-16 m-0 bg-gradient-to-b from-[#656E70] to-[rgba(255,255,255,1)]"/>
                            <div className="flex flex-col p-4 space-y-4">
                                <h1 className='text-white text-sm font-bold'><span className='fas fa-user mr-2'/>New Users</h1>
                                <h1  className='text-4xl text-bold text-white' >15</h1>
                                <button className="rounded-full border border-white text-white py-1 px-4">
                                    view insurers 
                                </button>
                            </div>
                            <div className="w-[1px] bg-white h-16 m-0 bg-gradient-to-b from-[#656E70] to-[rgba(255,255,255,1)]"/>
                            <div className="flex flex-col p-4 space-y-4">
                                <h1 className='text-white text-sm font-bold'><span className='fas fa-user mr-2'/>Policies</h1>
                                <h1  className='text-4xl text-bold text-white' >20</h1>
                                <button className="rounded-full border border-white text-white py-1 px-4">
                                    view users
                                </button>
                            </div>
                            <div className="w-[1px] bg-white h-16 m-0 bg-gradient-to-b from-[#656E70] to-[rgba(255,255,255,1)]"/>
                            <div className="flex flex-col p-4 space-y-4">
                                <h1 className='text-white text-sm font-bold'><span className='fas fa-user mr-2'/>New Users</h1>
                                <h1  className='text-4xl text-bold text-white' >125</h1>
                                <button className="rounded-full border border-white text-white py-1 px-4">
                                    view users
                                </button>
                            </div>                        
                        </div>
                        <SalesCharts/>
                    </div>
                </div>
                <div className="flex w-80">
                    <div className="flex flex-col p-2 space-y-2 items-center bg-gray-400 w-full rounded-md">
                        <div className="rounded-full overflow-hidden mt-8 h-36 w-36">
                            <img src="images/fidelis.jpeg" className='w-96' alt="" />
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
