import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicleInfo, getVehicleInformation } from '../../../store/payments-store';
import { PulseLoader } from 'react-spinners';

export default function VehicleDetails({ onChange, setNextButton }) {
    const [vehicleMake, setVehicleMake] = useState('');
    const [productId, setProductId] = useState('');
    const [vehicleColor, setVehicleColor] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [engineNumber, setEngineNumber] = useState('');
    const [vehicleUsage, setVehicleUsage] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [yearOfManufacture, setYearOfManufacture] = useState('');
    const [registrationYear, setRegistrationYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false); // New state for form validity

    const dispatch = useDispatch();
    const vehicleInfo = useSelector(getVehicleInformation);

    useEffect(() => {
        // Trigger onChange callback to parent component when form validity changes
        // onChange(isFormValid);
        setNextButton(isFormValid)
    }, [isFormValid, onChange]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the specific field
        setVehicleDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
        onChange(vehicleDetails)

        // Check if all required fields are filled
        const allFieldsFilled = Object.values({
            vehicleMake,
            vehicleModel,
            vehicleColor,
            vehicleType,
            engineNumber,
            vehicleUsage,
            registrationNumber,
            yearOfManufacture,
            registrationYear,
            [name]: value, // Include the updated field
        }).every((field) => field.trim() !== '');

        setIsFormValid(allFieldsFilled); // Update form validity state
    };

    function generateYearOptions() {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 13;
        const yearOptions = [];
      
        for (let year = startYear; year <= currentYear; year++) {
          yearOptions.push(year);
        }
      
        return yearOptions;
    }

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

    const vehicleVerification = (e) => {
        e.preventDefault();
        setLoading(true);
        const { registrationNumber } = vehicleDetails;
        dispatch(fetchVehicleInfo({ registrationNumber }))
            .then((response) => {
                console.log("search result: ", response);
                if (response.payload && response.payload.success) {
                    setProductId(response.payload.id);
                }
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            });
    };

    return (
        <>
            {/* Your form fields here */}
            {/* Example for Registration Number */}
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="registrationNumber" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Registration Number
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="text"
                        name="registrationNumber"
                        id="registrationNumber"
                        placeholder='Registration Number'
                        onChange={handleChange}
                        value={vehicleDetails.registrationNumber}
                        className="uppercase block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
                <button
                    className={`border border-gray-300 rounded-sm px-4 mt-2 py-1.5 ml-2 ${isFormValid ? 'bg-green-500' : 'bg-blue-500'} text-gray-100 w-40`}
                    onClick={vehicleVerification}
                >
                    {loading ? (
                        <>
                            Checking
                            <PulseLoader color={'#fff'} loading={loading} size={3} aria-label="Loading Spinner" />
                        </>
                    ) : (
                        vehicleInfo.vehicleModel ? "Record Found" : "Check Availability"
                    )}
                </button>
            </div>
            {/* Repeat for other fields... */}
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Make
                </label>
                <div className="mt-2 flex-1">
                    <input
                    type="text"
                    name="vehicleMake"
                    id="vehicleMake"
                    autoComplete="family-name"
                    placeholder="Vehicle Make"
                    onChange={handleChange}
                    value={vehicleInfo?vehicleInfo.vehicleMake:vehicleDetails.vehicleMake}
                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Model
                </label>
                <div className="mt-2 flex-1">
                    <input
                    type="text"
                    name="vehicleModel"
                    id="vehicleModel"
                    autoComplete="family-name"
                    placeholder='Vehicle Model'
                    onChange={handleChange}
                    value={vehicleInfo?vehicleInfo.vehicleModel:vehicleDetails.vehicleModel}
                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Vehicle Color
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="text"
                        name="vehicleColor"
                        id="vehicleColor"
                        autoComplete="family-name"
                        placeholder='Vehicle Color'
                        onChange={handleChange}
                        value={vehicleInfo?vehicleInfo.vehicleColor:vehicleDetails.vehicleColor}
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Engine Number
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="text"
                        name="engineNumber"
                        id="engineNumber"
                        autoComplete="family-name"
                        placeholder='Engine Number'
                        onChange={handleChange}
                        value={vehicleInfo?vehicleInfo.engineNumber:vehicleDetails.engineNumber}
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Year Of Manufacture
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="yearOfManufacture"
                        name="yearOfManufacture"
                        onChange={handleChange}
                        value={vehicleInfo?vehicleInfo.yearOfManufacture:vehicleDetails.yearOfManufacture}
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                    >
                        <option className="font-bold text-gray-600">{vehicleInfo.length>0?vehicleInfo.yearOfManufacture:"Select Year"}</option>
                        {generateYearOptions().map((year) => (
                            <option key={year} value={year}>
                            {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Registration Year
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="registrationYear"
                        name="registrationYear"
                        onChange={handleChange}
                        value={vehicleInfo?vehicleInfo.registrationYear:vehicleDetails.registrationYear}
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                    >
                        <option className="font-bold text-gray-600">{vehicleInfo.length>0?vehicleInfo.registrationYear:"Select Year"}</option>
                        {generateYearOptions().map((year) => (
                            <option key={year} value={year}>
                            {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Value
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="text"
                        name="adon"
                        id="adon"
                        autoComplete="family-name"
                        placeholder='Value'
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Vehicle Use
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="vehicleUsage"
                        name="vehicleUsage"
                        onChange={handleChange}
                        value={vehicleInfo?vehicleInfo.vehicleUsage:vehicleDetails.vehicleUsage}
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                    >
                        <option className="font-bold text-gray-600">{vehicleInfo.length>0?vehicleInfo.vehicleUsage:"Select Usage"}</option>
                        <option value="Private">Private Use</option>
                        <option value="Driving School">Driving School</option>
                        <option value="Commutting">Commutting</option>
                    </select>
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Vehicle Type
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="vehicleType"
                        name="vehicleType"
                        onChange={handleChange}
                        value={vehicleInfo?vehicleInfo.vehicleType:vehicleDetails.vehicleType}
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                    >
                        <option className="font-bold text-gray-600">{vehicleInfo.length>0?vehicleInfo.vehicleType:"Select Vehicle Type"}</option>
                        <option value="Motor Bike">Motor Bike</option>
                        <option value="Motor">Motor</option>
                        <option value="Minibus">Minibus</option>
                        <option value="Bus">Bus</option>
                        <option value="Truck">Truck</option>
                    </select>
                </div>
            </div>
        </>
    );
}