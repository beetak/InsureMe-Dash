import React, { useState } from 'react'
import Modal from '../../modal/Modal';

export default function FuneralInsuranceViewModal(props) {

    const getModal =(isOpen)=>{
        props.setModal(isOpen)
    }   

    return (
        <>
            <Modal setModal={getModal}>
                <div className="block border border-gray-200 p-8 mt-3 rounded-sm">                    
                    <div className="flex flex-col items-center text-gray-600 space-y-3">
                        <h2 className="text-lg font-semibold text-gray-600"><span className='font-semibold text-xs'>Product Name: </span>{props.data.planName}</h2>
                        <p className=''><span className='font-semibold text-xs'>Insurance Provider: </span>{props.data.insurer}</p>
                        <div className='w-full justify-center flex items-center'> <span className={` font-semibold uppercase text-xs tracking-wider px-3 text-white ${props.data.isActive?" bg-green-600": " bg-red-600 "} rounded-full py-1`}>{props.data.isActive?"Active":"Inactive"}</span></div>
                    </div>
                    <div className='overflow-auto rounded:xl shadow-md mt-4'>
                        <table className='w-full'>
                            <thead className='bg-gray-100 border-b-2 border-gray-300'>
                            {/* <tr >{renderTableHeader()}</tr> */}
                            </thead>
                            {/* <tbody >{renderTableRows()}</tbody> */}
                        </table>
                    </div>
                </div>
            </Modal>
        </>
    )
}
