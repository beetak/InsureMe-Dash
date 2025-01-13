import React, { useState } from 'react'
import { CircleLoader, ClockLoader, PacmanLoader, PulseLoader, RingLoader, SyncLoader } from 'react-spinners';
import BeatLoader from "react-spinners/BeatLoader";

export default function CustomerEditModal(props) {
    return (
        <div className='flex flex-col flex-1 h-screen justify-center bg-white bg-opacity-50 items-center fixed inset-0 z-50 top-0 left-0'>
            <div className='flex flex-col w-80  justify-center items-center bg-white h-40 rounded-lg'>
                <h1 className='text-xl flex text-black'>
                    text                    
                </h1>
            </div>
        </div>
    )
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}
