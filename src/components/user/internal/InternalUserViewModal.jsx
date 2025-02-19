import React, { useEffect, useState } from 'react'
import Modal from '../../modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../../store/category-store';
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi';
import useAuth from '../../../hooks/useAuth';

export default function InternalUserViewModal(props) {

    const { user, setUser } = useAuth()
    const [accountInfo, setAccountInfo] = useState({})

    const {data} = props.data
    console.log("data ", props.data)

    const getModal =(isOpen)=>{
        props.setModal(isOpen)
    }

    useEffect(() => {
        setupInterceptors(() => user, setUser)
        fetchUser()
    },[user, setUser])

    const fetchUser = async () => {
        try {
          const response = await InsuranceApi.get(`/users/userId/${props.data.id}`);
          if (response && (response.data.message === "User found" || response.data.message === "retrieved successfully")) {
            console.log(response);
            setAccountInfo(response.data.data);
          }
        } catch (err) {
          console.log(err);
          setMessage("Error fetching user");
        }
      };

    return (
        <>
            <Modal setModal={getModal}>
                <div className="block border border-gray-200 p-8 mt-3 rounded-sm">
                    <h2 className="text-lg font-semibold">Insurance Company Details</h2>
                    <p className="text-xs mb-4">A detailed report of the company</p>
                    <div className="flex border-b border-gray-500">
                        <div className="flex flex-col justify-center items-center w-1/2">
                            <img src={accountInfo.userLogo?accountInfo.userLogo:""} alt="" className=' w-44' />
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
                                props.data.userRegions&& props.data.userRegions.length>0&&               
                                <div className="sm:col-span-3 flex items-center">
                                    <i className="fa-solid fa-phone w-9 leading-6 text-sm font-medium"/>
                                    <div className=" flex-1">
                                        {props.data.mobileNumber}
                                    </div>
                                </div>
                            }                    
                            <div className="sm:col-span-3 flex items-center">
                                <i className="fa-solid fa-address-book w-9 leading-6 text-sm font-medium"/>
                                <div className=" flex-1">
                                    {props.data.address}
                                </div>
                            </div>
                                       
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-gray-600">
                        <h1 className='text-sm'><span className='font-semibold'>User Role: </span>{props.data.role}</h1>
                        <h1 className='text-sm'><span className='font-semibold'>Email Address: </span>Admin Email</h1>
                    </div>
                </div>
            </Modal>
        </>
    )
}
