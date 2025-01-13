import React from 'react'
import { useDispatch } from 'react-redux'
import { navActions } from '../../store/nav-store'

export default function TravelInsuranceSales() {

    const dispatch = useDispatch()

    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                <h2 className="text-lg font-semibold">Policy Sale</h2>
                <p className="text-xs mb-4">Covers Travel Security Risks</p>
                    {/* <Slider {...settings}>
                    {
                    insurer.map((item, index)=>{
                        return(
                        <div key={index} onClick={""}>
                            <h6 className="flex text-md justify-center font-semibold leading-1 h-8 cursor-pointer">{item}</h6>
                        </div>
                        )
                    })}
                    </Slider> */}
                <div className='space-y-1'>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Customer Name
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="family-name"
                            placeholder='Customer Name'
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="id-number" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            ID Number
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                            type="text"
                            name="id-number"
                            id="id-number"
                            autoComplete="family-name"
                            placeholder='ID Number'
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="id-number" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Trip Duration
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                            type="text"
                            name="id-number"
                            id="id-number"
                            autoComplete="family-name"
                            placeholder='ID Number'
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Policy
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                            id="insuranceType"
                            name="insuranceType"
                            className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                            <option value="Option 0">Normal</option>
                            <option value="Option 1">Premium</option>
                            </select>
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Number of Terms
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                            id="systemAdOns"
                            name="systemAdOns"
                            className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                            <option value="">Select Number of Terms</option>
                            <option value="Option 1">1</option>
                            <option value="Option 2">2</option>
                            <option value="Option 3">3</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='flex space-x-2 pt-10'>
                    <button
                        onClick={()=>dispatch(
                            navActions.toggleInvoice(true)
                        )}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Submit
                    </button>
                    <button
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Cancel
                    </button>
                </div>
            </div>
        </>
    )
}
