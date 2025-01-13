import React, { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { getVehicleInformation } from '../../../store/payments-store'
import { useDispatch, useSelector } from 'react-redux'

export default function AccountDetails() {
    const [firstName, setFirstName] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleDetails((prevDetails) => ({
          ...prevDetails,
          [name]: value,
        }));
        onChange(vehicleDetails);
    };

    const [userDetails, setUserDetails] = useState({
        firstName,
        surname,
        email,
        phoneNumber
    });

    const dispatch = useDispatch()

    useEffect(()=>{
    }, dispatch)

    const userInfo = useSelector(getVehicleInformation)

    const userVerification = (e) => {
        e.preventDefault()
        setLoading(true)
        const { userEmail } = userDetails;
        dispatch(fetchVehicleInfo({registrationNumber}))
        .then((response)=>{
            console.log("search result: ", response)
            if(response.payload&&response.payload.success){
                // setLoading(false)
                setProductId(response.payload.id)
            }
        })
        .finally(()=>{
            setTimeout(()=>{
                setLoading(false)
            },1000)
        })
    }
    return (
        <>
            {/* <h2>Car Owner Details</h2> */}
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Firstname(s)
                </label>
                <div className="mt-2 flex-1">
                    <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="family-name"
                    placeholder='First Name'
                    onChange={handleChange}
                    value={userInfo?userInfo.registrationNumber:vehicleDetails.registrationNumber}
                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
                <button
                    className={`border border-gray-300 rounded-sm px-4 mt-2 py-1.5 ml-2 bg-blue-500 text-gray-100 w-40`}
                    onClick={userVerification}
                >
                    {
                        loading?
                        <>
                            Checking
                            <PulseLoader
                                color={'#fff'}
                                loading={loading}
                                cssOverride={override}
                                size={3} // Adjust the size as needed
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </>:
                        "Check Availability"
                    }
                </button>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Surname
                </label>
                <div className="mt-2 flex-1">
                    <input
                    type="text"
                    name="surname"
                    id="surname"
                    autoComplete="family-name"
                    placeholder='Surname'
                    onChange={()=>setSurname(e.target.value)}
                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Email Address
                </label>
                <div className="mt-2 flex-1">
                    <input
                    type="text"
                    name="email"
                    id="email"
                    autoComplete="family-name"
                    placeholder='Year'
                    onChange={()=>setEmail(e.target.value)}
                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Phone Number
                </label>
                <div className="mt-2 flex-1">
                    <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    autoComplete="family-name"
                    placeholder='Owner Details'
                    onChange={()=>phoneNumber(e.target.value)}
                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
        </>
    )
}

const override = {
    display: "inline",
    margin: "0 auto",
    borderColor: "blue",
}