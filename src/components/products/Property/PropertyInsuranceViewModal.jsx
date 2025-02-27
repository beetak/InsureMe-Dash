import React, { useState } from 'react'
import Modal from '../../modal/Modal';

export default function PropertyInsuranceViewModal(props) {

    const getModal =(isOpen)=>{
        props.setModal(isOpen)
    }

    function formatPolicyName(policy) {
        if(policy==="DOMESTIC_COMBINED_STANDARD_CONSTRUCTION")
          return "Domestic Combined Standard Construction"
        else if(policy==="DOMESTIC_COMBINED_NON_STANDARD_CONSTRUCTION")
          return "Domestic Combined Non Standard Construction"
        else{
          return policy
        }
    }

    return (
        <>
            <Modal setModal={getModal}>
                <div className="block border border-gray-200 p-8 mt-3 rounded-sm">                    
                    <div className="flex flex-col items-center text-gray-600 space-y-3">
                        <h2 className="text-lg font-semibold text-gray-600"><span className='font-semibold text-xs'>Product Name: </span>{formatPolicyName(props.data.policy)}</h2>
                        <p className=''><span className='font-semibold text-xs'>Policy Description: </span>{props.data.description}</p>
                        <p className=''><span className='font-semibold text-xs'>Insurance Company: </span>{props.data.insurerName}</p>
                        <p className=''><span className='font-semibold text-xs'>Policy Rate: </span>{props.data.rate}</p>
                        <div className='w-full justify-center flex items-center'> <span className={` font-semibold uppercase text-xs tracking-wider px-3 text-white ${props.data.active?" bg-green-600": " bg-red-600 "} rounded-full py-1`}>{props.data.active?"Active":"Inactive"}</span></div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
