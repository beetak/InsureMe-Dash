import React from 'react'

export default function WeeklyReport() {
  return (
    <>
        <div className="flex flex-col w-full p-2 space-y-3">
            <h3 className='pb-2'>Scheduled Reports</h3>
            <div className="grid grid-cols-3 gap-10 items-center w-full">
                <h2>Weekly Sales Report</h2>
                <button className='bg-gray-600 text-white rounded-md px-3 w-28'>
                    Scheduled
                </button>
                <div className="flex text-sm justify-between space-x-4">
                    <button className='flex flex-col'>
                        <i className='fa fa-print'/>
                        Print
                    </button>
                    <button className="flex flex-col">
                        <i className='fa fa-download'/>
                        Download
                    </button>
                    <button className="flex flex-col">
                        <i className='fa fa-trash'/>
                        Delete
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-10 items-center w-full">
                <h2>Daily Financials Report</h2>
                <button className='bg-green-600 text-white rounded-md px-3 w-28'>
                    Complete
                </button>
                <div className="flex text-sm justify-between space-x-4">
                    <button className='flex flex-col'>
                        <i className='fa fa-print'/>
                        Print
                    </button>
                    <button className="flex flex-col">
                        <i className='fa fa-download'/>
                        Download
                    </button>
                    <button className="flex flex-col">
                        <i className='fa fa-trash'/>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </>
  )
}
