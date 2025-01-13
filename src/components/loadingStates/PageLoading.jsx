import React, { useState } from 'react'
import { CircleLoader, ClockLoader, PacmanLoader, PulseLoader, RingLoader, SyncLoader } from 'react-spinners';
import BeatLoader from "react-spinners/BeatLoader";

export default function PageLoading(props) {
    return (
        <div className='flex flex-col flex-1 h-screen justify-center bg-blue-500 bg-opacity-50 items-center fixed inset-0 z-50 top-0 left-0'>
            <div className='flex flex-col w-80  justify-center items-center bg-gray-700 h-40 rounded-lg'>
                <RingLoader
                    color={'#fff'}
                    loading={props.loadingStatus}
                    cssOverride={override}
                    size={100} // Adjust the size as needed
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
                <h1 className='text-xl flex text-white'>
                    {
                        props.loading&&!props.success&&!props.failed?"Loading":props.loading&&props.success&&!props.failed?"Successful":props.loading&&!props.success&&props.failed&&"Failed"
                    }
                    
                    <PulseLoader
                        color={'#fff'}
                        loading={props.loading}
                        cssOverride={override}
                        size={6} // Adjust the size as needed
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
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
