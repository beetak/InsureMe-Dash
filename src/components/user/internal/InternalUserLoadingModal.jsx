import React, { useEffect, useState } from 'react'
import Modal from '../../modal/Modal';
import { RingLoader } from 'react-spinners';

export default function UserLoadingModal(props) {

    console.log("props ", props)

    useEffect(()=>{
    }, [props])

    const getModal =(isOpen)=>{
        props.setModal(isOpen)
    }

    return (
        <>
            <Modal setModal={getModal}>
                <div className="block border border-gray-200 p-8 mt-3 rounded-sm">
                    <h2 className="text-lg font-semibold">User Creation Status</h2>
                    <p className="text-xs mb-4">{props.loading&&!props.message.status?"Please wait":""}</p>
                    <div className="flex border-b border-gray-500">
                        <div className="flex flex-col justify-center items-center w-1/2 my-3">                            
                            <img src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png" alt="" className=' w-44' />     
                        </div>
                        <div className='space-y-1 text-blue-500 border-l p-3 border-gray-500'>
                            {
                                !props.message.status ? 
                                <div className='flex flex-col w-80 justify-center items-center h-40'>
                                    <RingLoader
                                        color={'#000'}
                                        loading={props.loading}
                                        cssOverride={override}
                                        size={100} // Adjust the size as needed
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                </div>: 
                                <>
                                    <div className="sm:col-span-3 flex items-center">
                                        <div className=" flex w-24">
                                            Firstname:
                                        </div>
                                        <div className=" flex-1">
                                            {props.message.data&&props.message.data.data.firstName}
                                        </div>
                                    </div>   
                                                        
                                    <div className="sm:col-span-3 flex items-center">
                                        <div className=" flex w-24">
                                            Surname:
                                        </div>
                                        <div className=" flex-1">
                                            {props.message.data&&props.message.data.data.lastName}
                                        </div>
                                    </div>

                                    {
                                        props.message.region && 
                                        <div className="sm:col-span-3 flex items-center">
                                            <div className=" flex w-24">
                                                Region:
                                            </div>
                                            <div className=" flex-1">
                                                {props.message.region}
                                            </div>
                                        </div>
                                    }      

                                    {
                                        props.message.town && 
                                        <div className="sm:col-span-3 flex items-center">
                                            <div className=" flex w-24">
                                                Town:
                                            </div>
                                            <div className=" flex-1">
                                                {props.message.town}
                                            </div>
                                        </div>
                                    } 

                                    {
                                        props.message.shop && 
                                        <div className="sm:col-span-3 flex items-center">
                                            <div className=" flex w-24">
                                                Shop:
                                            </div>
                                            <div className=" flex-1">
                                                {props.message.shop.shopName}
                                            </div>
                                        </div>
                                    } 
                                </>
                            }                            
                                      
                        </div>
                    </div>
                    {
                        props.message.status? 
                        <div className="flex flex-col mt-3 items-center text-gray-600">
                            <h1 className='text-sm'><span className='font-semibold'>Job Title: </span> ""</h1>
                            {/* <h1 className='text-sm'><span className='font-semibold'>Domain Name: </span>{props.message.data.email}</h1> */}
                        </div>:""
                    }
                </div>
            </Modal>
        </>
    )
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}
