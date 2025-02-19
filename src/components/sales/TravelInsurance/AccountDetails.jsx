import React, { useContext, useEffect, useState } from 'react'
import { StepperContext } from '../../../context/StepperContext'

export default function AccountDetails() {

    const { travelData, setTravelData } = useContext(StepperContext)
    const [error, setError] = useState([])

    useEffect(() => {
        if (!travelData.travelers) {
            setTravelData(prevData => ({
                ...prevData,
                travelers: [{ fullName: '', dob: '', passportNumber: '' }]
            }))
        }
    }, [travelData, setTravelData])

    const addTraveler = () => {
        setTravelData(prevData => ({
            ...prevData,
            travelers: [
                ...prevData.travelers,
                { fullName: '', dob: '', passportNumber: '' }
            ]
        }))
    }

    const removeTraveler = (index) => {
        setTravelData(prevData => ({
            ...prevData,
            travelers: prevData.travelers.filter((_, i) => i !== index)
        }))
    }

    const handleTravelersChange = (e, index) => {
        const { name, value } = e.target
        setTravelData(prevData => {
            const updatedTravelers = [...prevData.travelers]
            updatedTravelers[index] = { ...updatedTravelers[index], [name]: value }
            return { ...prevData, travelers: updatedTravelers }
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTravelData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            {(travelData.travelers || []).map((traveler, index) => (
                <div key={index} className="sm:col-span-3 flex items-center mt-2">
                    <label htmlFor={`traveler-${index}`} className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Traveler {index + 1}
                    </label>
                    <div className="block flex-1">
                        {index === 0 && error.length > 0 &&
                            error.map((err, errIndex) => {
                                if (err.err === "address") {
                                    return <h6 key={errIndex} className='text-red-500 mb-1'>{err.message}</h6>
                                }
                                return null
                            })
                        }
                        <div className="grid grid-cols-2 border border-gray-300 p-2">
                            <div className="flex items-center w-full mb-4 sm:mb-0 sm:mr-4">
                                <label htmlFor={`fullName-${index}`} className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                                    Full Name
                                </label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="fullName"
                                        id={`fullName-${index}`}
                                        autoComplete="given-name"
                                        placeholder="Full Name"
                                        onChange={(e) => handleTravelersChange(e, index)}
                                        value={traveler.fullName || ""}
                                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center w-full ml-1">
                                <label htmlFor={`dob-${index}`} className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                                    Date of Birth
                                </label>
                                <div className="flex-1">
                                    <input
                                        type="date"
                                        name="dob"
                                        id={`dob-${index}`}
                                        onChange={(e) => handleTravelersChange(e, index)}
                                        value={traveler.dob || ""}
                                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center w-full mt-2">
                                <label htmlFor={`passportNumber-${index}`} className="block text-sm font-medium leading-4 text-gray-900 w-1/4">
                                    Passport Number
                                </label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="passportNumber"
                                        id={`passportNumber-${index}`}
                                        autoComplete="passport-number"
                                        placeholder="Enter Passport Number"
                                        onChange={(e) => handleTravelersChange(e, index)}
                                        value={traveler.passportNumber || ""}
                                        className="uppercase block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>                        
                    </div>
                    {index === travelData.travelers.length - 1 ? (
                        travelData.travelers.length < 3 ? (
                            <span onClick={addTraveler} className="fas fa-plus px-3 cursor-pointer" />
                        ) : (
                            <span className="fas fa-plus px-3 opacity-50 cursor-not-allowed" />
                        )
                    ) : (
                        <span onClick={() => removeTraveler(index)} className="fas fa-minus px-3 cursor-pointer" />
                    )}
                </div>
            ))}
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Phone Number
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        autoComplete="family-name"
                        placeholder='Phone Number'
                        onChange={handleChange}
                        value={travelData["phoneNumber"] || ""}
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Email Address
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="text"
                        name="email"
                        id="email"
                        autoComplete="email"
                        placeholder='Email Address'
                        onChange={handleChange}
                        value={travelData["email"] || ""}
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
        </>
    )
}