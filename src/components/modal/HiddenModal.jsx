import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { CircleLoader, ClockLoader, PacmanLoader, PulseLoader, RingLoader, SyncLoader } from 'react-spinners';
import BeatLoader from "react-spinners/BeatLoader";
import { getCategories } from '../../store/category-store';

export default function HiddenModal(props) {

    const isOpen = false

    return (
        <div className='flex-col flex-1 justify-center bg-gray-200 bg-opacity-50 items-center fixed inset-0 z-50 top-0 left-0' style={{ display: props.hidden ? 'flex' : 'none' }} onClick={() => props.setModal(isOpen)}>
            <div className='flex flex-col w-1/2 max-h-[650px] overflow-auto justify-center bg-white p-8 rounded-lg border border-gray-200' onClick={(e) => e.stopPropagation()}>
                <div className='w-full flex justify-end'>
                    <a 
                        href="#"
                        onClick={() => props.setModal(isOpen)}
                        className='bg-gray-500 w-8 h-8 rounded-full flex justify-center items-center'
                    >
                        <i className='fas fa-times text-white'/>
                    </a>
                </div>
                <div className='overflow-y-auto px-6'>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}
