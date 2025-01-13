import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SalesCharts from './SalesCharts'
import useAuth from '../../hooks/useAuth'
import { setupInterceptors } from '../api/InsuranceApi'

const shopName = localStorage.getItem('shopName')
const townName = localStorage.getItem('towmName')
const regionName = localStorage.getItem('regionName')
const userRole = localStorage.getItem('role')

export default function InsuranceStats() {
    const { user, setUser} = useAuth()

    useEffect(()=>{
        setupInterceptors(() => user, setUser)
    })

    return (
        <>
            <div className="flex w-full space-x-3">
                <div className="flex flex-1 bg-white">
                    <div className="flex-col flex w-full">
                        <div className="flex justify-around bg-gradient-to-r from-[#656E70] to-main-color w-full rounded-md h-40 items-center">
                            <div className="flex flex-col py-4 space-y-4 items-center w-[28%]">
                                <h1 className='text-white text-sm font-bold'>Vehicle Insurance</h1>
                                <h1  className='text-4xl text-bold text-white' ><i className='fa fa-car'/></h1>                                
                                <div className="flex w-full text-white justify-around">
                                    <p className='flex flex-col text-xs'>Vehicles<span className='text-lg'>200</span></p>
                                    <p className='flex flex-col text-xs'>Premium<span className='text-lg'>200,222,444.00</span></p>
                                </div>
                            </div>
                            <div className="w-[1px] bg-white h-16 m-0 bg-gradient-to-b from-[#656E70] to-[rgba(255,255,255,1)]"/>
                            <div className="flex flex-col py-4 space-y-4 items-center w-[28%]">
                                <h1 className='text-white text-sm font-bold'>Other Insurance</h1>
                                <h1  className='text-4xl text-bold text-white' ><i class="fa-solid fa-shield-halved"></i></h1>                                
                                <div className="flex w-full text-white justify-around">
                                    <p className='flex flex-col text-xs'>Number<span className='text-lg'>200</span></p>
                                    <p className='flex flex-col text-xs'>Premium<span className='text-lg'>200,222,444.00</span></p>
                                </div>
                            </div>
                            <div className="w-[1px] bg-white h-16 m-0 bg-gradient-to-b from-[#656E70] to-[rgba(255,255,255,1)]"/>
                            <div className="flex flex-col py-4 space-y-4 items-center w-[38%]">
                                <h1 className='text-white text-sm font-bold'><span className='fas fa-user mr-2'/>Daily Stats</h1>
                                <div className="flex w-full">
                                    <div className="flex flex-col px-4 space-y-4 w-1/2">
                                        <h1  className='text-xs text-bold text-white' ><i className='fa fa-car text-lg mr-4'/>Vehicle Insurance</h1>                                
                                        <div className="flex w-full text-white justify-between">
                                            <p className='flex flex-col'>200<span className='text-xs'>Zig 200,000.00</span><span className='text-xs'>USD 12,000.00</span></p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col px-4 space-y-4 w-1/2">
                                        <h1  className='text-xs text-bold text-white' ><i class="fa-solid fa-shield-halved text-lg mr-4"/>Other Insurance</h1>                                
                                        <div className="flex w-full text-white justify-between">
                                            <p className='flex flex-col'>200<span className='text-xs'>Zig 200,000.00</span><span className='text-xs'>USD 12,000.00</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>                        
                        </div>
                        {/* <SalesCharts/> */}
                    </div>
                </div>
                <div className="flex w-80">
                    <div className="flex flex-col p-2 space-y-2 items-center bg-gray-400 w-full rounded-md">
                        <div className="rounded-full overflow-hidden mt-8 h-36 w-36">
                            <img src="images/fidelis.jpeg" className='w-96' alt="" />
                        </div>
                        <h1 className='text-white text-xl'>{user.firstname} {user.surname}</h1>
                        <h1  className='text-xs text-bold text-white' >{userRole}</h1>
                        <h1  className='text-xs text-bold text-white' >
                            {
                                user.role !== "INSURER_ADMIN" ? (
                                    shopName ? (
                                        <span>{shopName} Shop</span>
                                    ) : townName ? (
                                        <span>{townName} Shop</span>
                                    ) : regionName ? (
                                        <span>{regionName} Shop</span>
                                    ) : (
                                        "TelOne Private Limited"
                                    )
                                ) : (
                                    <span>{user.companyName}</span>
                                )
                            }
                        </h1>
                        <div className="flex flex-col w-full rounded-md space-y-2 bg-white p-2">
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
