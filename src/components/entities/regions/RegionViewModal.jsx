import React, { useState } from 'react'
import Modal from '../../modal/Modal';

export default function RegionViewModal(props) {

    const getModal =(isOpen)=>{
        props.setModal(isOpen)
    }
    
    function formatDate(dateString) {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        return formattedDate;
    }

    return (
        <>
            <Modal setModal={getModal}>
                <div className="block border border-gray-200 p-8 mt-3 rounded-sm">                    
                    <div className="flex flex-col items-center text-gray-600 space-y-3">
                        <h2 className="text-lg font-semibold text-gray-600">{props.data.name} Region</h2>
                        {/* <p className=''>Date Created: {formatDate(props.data.createdAt)}</p> */}
                        <div className='w-full justify-center flex items-center'> <span className={` font-semibold uppercase text-xs tracking-wider px-3 text-white ${props.data.active?" bg-green-600": " bg-red-600 "} rounded-full py-1`}>{props.data.active?"Active":"Inactive"}</span></div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
