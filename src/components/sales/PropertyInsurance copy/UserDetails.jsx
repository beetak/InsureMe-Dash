import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVehicleInfo, getVehicleInformation } from '../../../store/payments-store'
import { PulseLoader } from 'react-spinners'
import PassportUploadModal from './PassportUploadModal'

export default function UserDetails({ onChange }) {

    const [vehicleMake, setVehicleMake] = useState()
    const [productId, setProductId] = useState()
    const [vehicleColor, setVehicleColor] = useState()
    const [vehicleModel, setVehicleModel] = useState()
    const [vehicleType, setVehicleType] = useState()
    const [engineNumber, setEngineNumber] = useState()
    const [vehicleUsage, setVehicleUsage] = useState()
    const [registrationNumber, setRegistrationNumber] = useState()
    const [yearOfManufacture, setYearOfManufacture] = useState()
    const [registrationYear, setRegistrationYear] = useState()
    const [loading, setLoading] = useState(false)
    const [imageName, setImageName] = useState("")
    const [currentImage, setCurrentImage] = useState(false)

    function generateYearOptions() {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 13;
        const yearOptions = [];
      
        for (let year = startYear; year <= currentYear; year++) {
          yearOptions.push(year);
        }
      
        return yearOptions;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleDetails((prevDetails) => ({
          ...prevDetails,
          [name]: value,
        }));
        onChange(vehicleDetails);
    };

    const [vehicleDetails, setVehicleDetails] = useState({
        vehicleMake,
        vehicleModel,
        vehicleColor,
        vehicleType,
        engineNumber,
        vehicleUsage,
        registrationNumber,
        yearOfManufacture,
        registrationYear
    });

    const dispatch = useDispatch()

    useEffect(()=>{

    }, dispatch)

    const vehicleInfo = useSelector(getVehicleInformation)

    const vehicleVerification = (e) => {
        e.preventDefault()
        setLoading(true)
        const { registrationNumber } = vehicleDetails;
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

    const getModal =(isOpen)=>{
        setCurrentImage(isOpen)
    }

    const getImage =(image, imageName)=>{
        setImage(image)
        setImageName(imageName)
    }

    const showModal = (showPage) => {
        setCurrentPage(true)
    }

    return (
        <>
            {/* <h2>Vehicle Details</h2> */}
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    National ID Number
                </label>
                <div className="mt-2 flex-1">
                    <input
                    type="text"
                    name="idNumber"
                    id="idNumber"
                    autoComplete="family-name"
                    placeholder='National ID Number'
                    onChange={handleChange}
                    value={vehicleInfo?vehicleInfo.registrationNumber:vehicleDetails.registrationNumber}
                    className="uppercase block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
                <button
                    className={`border border-gray-300 rounded-sm px-4 mt-2 py-1.5 ml-2 ${vehicleInfo.vehicleModel?'bg-green-500':'bg-blue-500'} text-gray-100 w-40`}
                    onClick={vehicleVerification}
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
                        vehicleInfo.vehicleModel? "Record Found":
                        "Check Availability"
                    }
                </button>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Firstname
                </label>
                <div className="mt-2 flex-1">
                    <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    autoComplete="family-name"
                    placeholder="Firstname"
                    onChange={handleChange}
                    value={vehicleInfo?vehicleInfo.vehicleMake:vehicleDetails.vehicleMake}
                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
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
                    onChange={handleChange}
                    value={vehicleInfo?vehicleInfo.vehicleModel:vehicleDetails.vehicleModel}
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
                        placeholder='Phone Number'
                        onChange={handleChange}
                        value={vehicleInfo?vehicleInfo.vehicleColor:vehicleDetails.vehicleColor}
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Physical Address
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="text"
                        name="physicalAddress"
                        id="physicalAddress"
                        autoComplete="family-name"
                        placeholder='Physical Address'
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
                        name="emailAddress"
                        id="emailAddress"
                        autoComplete="family-name"
                        placeholder='Email Address'
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Notes
                </label>
                <div className="mt-2 flex-1">
                    <textarea
                        type="text"
                        name="notes"
                        id="notes"
                        autoComplete="family-name"
                        placeholder='Notes'
                        onChange={handleChange}
                        value={vehicleInfo?vehicleInfo.engineNumber:vehicleDetails.engineNumber}
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            {/* <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Renewal Frequency
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="frequency"
                        name="frequency"
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                    >
                        <option className="font-bold text-gray-600">Select Renewal Frequency</option>
                    </select>
                </div>
            </div> */}
        </>
    )
}

const override = {
    display: "inline",
    margin: "0 auto",
    borderColor: "blue",
}