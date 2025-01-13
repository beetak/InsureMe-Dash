import React, { useState } from 'react'
import Modal from '../../modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../../store/category-store';

export default function InternalUserViewModal(props) {

    const dispatch = useDispatch()

    const {data} = props.data
    console.log("data ", props.data)

    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [price, setPrice] = useState("");
    const [productCategoryId, setProductCategoryId] = useState(0);
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [close, setClose] = useState(false)

    const categories = useSelector(getCategories)

    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(1)

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
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-vceT-8TlULBydCT6QdmlAtpCOrC7VWoNoqawMaqiii6JOIJvSFf8VxibV-SzB6wO5w&usqp=CAU" alt="" className=' w-44' />
                            <h2 className="text-lg font-semibold text-gray-600">{props.data.insurerName}</h2>
                            <div className='w-full justify-center flex items-center'> <span className={` font-semibold uppercase text-xs tracking-wider px-3 text-white ${props.data.isActive?" bg-green-600": " bg-red-600 "} rounded-full py-1`}>{props.data.isActive?"Active":"Inactive"}</span></div>
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
                                    {props.data.officeNumber}
                                </div>
                            </div>
                            {
                                props.data.mobileNumber&&               
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
                            {
                                props.data.secondAddress&&               
                                <div className="sm:col-span-3 flex items-center">
                                    <i className="fa-regular fa-address-book w-9 leading-6 text-sm font-medium"/>
                                    <div className=" flex-1">
                                        {props.data.secondAddress}
                                    </div>
                                </div>
                            }                   
                            {
                                props.data.websiteUrl&&               
                                <div className="sm:col-span-3 flex items-center">
                                    <i className="fas fa-globe w-9 leading-6 text-sm font-medium"/>
                                    <div className=" flex-1">
                                        {props.data.websiteUrl}
                                    </div>
                                </div>
                            }                   
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-gray-600">
                        <h1 className='text-sm'><span className='font-semibold'>Admin: </span>Company Admin</h1>
                        <h1 className='text-sm'><span className='font-semibold'>Email Address: </span>Admin Email</h1>
                    </div>
                </div>
            </Modal>
        </>
    )
}
