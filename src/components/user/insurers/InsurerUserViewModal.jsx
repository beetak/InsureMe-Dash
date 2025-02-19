import React, { useState } from 'react'
import Modal from '../../modal/Modal';
import { useDispatch, useSelector } from 'react-redux';

export default function InsurerUserViewModal(props) {

    console.log("data ", props.data)

    const getModal =(isOpen)=>{
        props.setModal(isOpen)
    }

    return (
        <>
            <Modal setModal={getModal}>
                <div className="block border border-gray-200 p-8 mt-3 rounded-sm">
                    <h2 className="text-lg font-semibold">Insurance Company Details</h2>
                    <p className="text-xs mb-4">A detailed report of the company</p>
                    <div className="flex border-b border-gray-500">
                        <div className="flex flex-col justify-center items-center w-1/2">
                            {/* <img src="" alt="company logo" className=' w-44' /> */}
                            <h2 className="text-lg font-semibold text-gray-600">{props.data.insurerName}</h2>
                            <div className='w-full justify-center flex items-center'> <span className={` font-semibold uppercase text-xs tracking-wider px-3 text-white ${props.data.active?" bg-green-600": " bg-red-600 "} rounded-full py-1`}>{props.data.active?"Active":"Inactive"}</span></div>
                        </div>
                        <div className='space-y-1 text-blue-500 border-l p-3 border-gray-500'>
                            <div className="sm:col-span-3 flex items-center">
                                <i className="fas fa-envelope w-9 leading-6 text-sm font-medium"/>
                                <div className=" flex-1">
                                    {props.data.email}
                                </div>
                            </div>   
                            {
                                props.data.secondEmail&&               
                                <div className="sm:col-span-3 flex items-center">
                                    <i className="fas fa-user w-9 leading-6 text-sm font-medium"/>
                                    <div className=" flex-1">
                                        {props.data.secondMmail}
                                    </div>
                                </div>
                            }                      
                            <div className="sm:col-span-3 flex items-center">
                                <i className="fas fa-phone w-9 leading-6 text-sm font-medium"/>
                                <div className=" flex-1">
                                    {props.data.phoneNumber}
                                </div>
                            </div>
                            {
                                props.data.mobileNumber&&               
                                <div className="sm:col-span-3 flex items-center">
                                    <i className="fa-solid fa-address-book w-9 leading-6 text-sm font-medium"/>
                                    <div className=" flex-1">
                                        {props.data.mobileNumber}
                                    </div>
                                </div>
                            }                 
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-gray-600">
                        <h1 className='text-sm'><span className='font-semibold'>User Role: </span>
                            {
                                props.data.role==="INSURER_ADMIN"?"Admin":
                                props.data.role==="TREASURY_ACCOUNTANT"?"Accountant":
                                props.data.role==="MANAGER"?"Finance Manager":
                                props.data.role==="IT_SUPPORT"?"Support":"Product Manager"
                            }
                        </h1>
                        <h1 className='text-sm'><span className='font-semibold'>Work Title: </span>{props.data.title}</h1>
                    </div>
                </div>
            </Modal>
        </>
    )
}
