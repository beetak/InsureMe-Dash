import React, { useContext, useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { StepperContext } from '../../../context/StepperContext'
import IceCashApi from '../../api/IceCashApi'
import vehicleClasses from './../../vehicleClass.json'

export default function VehicleDetails() {

    const [ loading, setLoading ] = useState(false)
    const [ searchStatus, setSearchStatus ] = useState(false)
    const { vehicleData, setVehicleData } = useContext(StepperContext)

    useEffect(()=>{
    },[vehicleData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setVehicleData({...vehicleData, [name] : value})
        if (name === 'VRN') {
            updateVehicleRegistration(value);
        }
    }

    function updateVehicleRegistration(registration) {
        setVehicle((prevVehicle) => ({
            ...prevVehicle,
            Request: {
                ...prevVehicle.Request,
                Vehicles: [
                    {
                        ...prevVehicle.Request.Vehicles[0],
                        VRN: registration
                    }
                ]
            }
        }));
        setTpiQuote((prevVehicle) => ({
            ...prevVehicle,
            Request: {
                ...prevVehicle.Request,
                Vehicles: [
                    {
                        ...prevVehicle.Request.Vehicles[0],
                        VRN: registration
                    }
                ]
            }
        }));
    }    

    function generateYearOptions() {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 13;
        const yearOptions = [];
        for (let year = startYear; year <= currentYear; year++) {
          yearOptions.push(year);
        }
        return yearOptions;
    }

    const [vehicle, setVehicle] = useState({
        Version: "2.0",
        Request: {
            Function: "LICQuote",
            Vehicles: [
                {
                    VRN: vehicleData.VRN,
                    IDNumber: "ABCDEFGHIJ1",
                    ClientIDType: "1",
                    FirstName: "John",
                    LastName: "Doe",
                    Address1: "Address line 1",
                    Address2: "Address line 2",
                    SuburbID: "2",
                    LicFrequency: "3",
                    RadioTVUsage: "1",
                    RadioTVFrequency: "1"
                }
            ]
        }
    })

    const [tpiQuote, setTpiQuote] = useState({
        Version: "2.1",
        Request: {
            Function: "TPIQuote",
            Vehicles: [
            {
                VRN:  vehicleData.VRN,
                InsuranceCompanyID: "6",
                EntityType: "Personal",
                IDNumber: "ABCDEFGHIJ1",
                CompanyName: "TelOne",
                FirstName: "John",
                LastName: "Smith",
                MSISDN: "0771234123",
                Email: "email@ice.cash",
                Address1: "Address line 1",
                Address2: "Address line 2",
                Town: "Town",
                BirthDate: "",
                Owner_FirstName: "Jane",
                Owner_LastName: "Smith",
                Owner_MSISDN: "0771234123",
                Owner_Email: "email@ice.cash",
                Owner_Address1: "Address line 1",
                Owner_Address2: "Address line 2",
                Owner_Town: "Town",
                Owner_BirthDate: "19900126",
                InsuranceType: "3",
                VehicleType: "2",
                VehicleValue: "1000",
                DurationMonths: "4",
                CustomerReference: "Ref 1",
                Currency: "ZWG"
            }]
        }
    })

    const vehicleVerification = async () =>{
        setLoading(true)
        try{
            const response = await IceCashApi.post(`/request/20500338/license/quotes`, vehicle)
            // console.log("LIC RESP", response.data.Response.Quotes)
            if(response.statusText==="OK" && response.data.Response.Quotes>0){
                const quotes = response.data.Response.Quotes
                if (quotes && quotes.length > 0) {
                    const { VRN, make, model } = quotes[0];
                    const vehicleData = {
                        VRN,
                        make,
                        model,
                    };
                    setVehicleData(vehicleData);
                } else {
                    console.error('No quotes available in the response.');
                }
            }
        }
        catch(error){
            if(error.response.statusText==="Forbidden"){
                requestToken()
            }
        }
        finally{
            setLoading(false)
        }
    }

    const vehicleTPIQuote = async () =>{
        setSearchStatus(false)
        setVehicleData({...vehicleData, taxClass: "", make: "", model: "", YearManufacture: "", usage: "", vehicleType: ""})
        setLoading(true)
        try{
            console.log("TPI", tpiQuote)
            const response = await IceCashApi.post(`/request/20500338/tpi/quotes`, tpiQuote)
            console.log("TPI RESP", response)
            if(response.statusText==="OK" && response.data.Response.Message=== "Partner Token has expired. "){
                requestToken()
            }            
            else if(response.statusText==="OK" && response.data.Response.Result === 1){
                const quotes = response.data.Response.Quotes
                if (quotes && quotes.length > 0) {
                    setSearchStatus(true)
                    const { VRN, Vehicle } = quotes[0];
                    console.log("quote", quotes[0].Vehicle)
                    const vehicleData = {
                        VRN,
                        make: Vehicle.Make,
                        model: Vehicle.Model,
                        YearManufacture: Vehicle.YearManufacture,
                        usage: getVehicleUse(Vehicle.TaxClass),
                        taxClass: getVehicleClass(Vehicle.TaxClass),
                        vehicleType: getVehicleType(Vehicle.TaxClass),
                        vehicleTypeId: Vehicle.VehicleType
                    };
                    setVehicleData(vehicleData);
                } else {
                    console.error('No quotes available in the response.');
                }
            }
            
        }
        catch(error){
            if(error.response.statusText==="Forbidden"){
                requestToken()
            }
        }
        finally{
            setLoading(false)
        }
    }

    const requestToken = async () => {
        try{
            const response = await IceCashApi.post(`/request/20500338/token`)
            if(response.statusText==="OK" && response.data.token){
                console.log("res", response)
                vehicleTPIQuote()
            }
            else if(""){
                
            }
        }
        catch(error){
            console.log(error)
        }
    }

    const getVehicleClass = (taxClass) => {
        const vehicleClass = vehicleClasses.find(item => item.TaxClass === taxClass);
        return vehicleClass ? vehicleClass.TaxClassDescription : "Tax class not found";
    }
   
    const getVehicleType = (type) => {
        const typeInt = parseInt(type, 10);
        const vehicleType = vehicleClasses.find(item => item.VehicleType === typeInt);
        return vehicleType ? vehicleType.Type : "Type not found";
    };
   
    const getVehicleUse = (taxClass) => {
        const vehicleUse = vehicleClasses.find(item => item.TaxClass === taxClass);
        return vehicleUse ? vehicleUse.Use : "Usage not found";
    };

    return (
        <>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Registration Number
                </label>
                <div className="mt-2 flex-1">
                    <input
                    type="text"
                    name="VRN"
                    id="VRN"
                    autoComplete="family-name"
                    placeholder='Registration Number'
                    onChange={handleChange}
                    value={vehicleData["VRN"] || ""}
                    className="uppercase block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
                <button
                    className={`border border-gray-300 rounded-sm px-4 mt-2 py-1.5 ml-2 ${searchStatus?'bg-green-500':'bg-blue-500'} text-gray-100 w-40`}
                    onClick={vehicleTPIQuote}
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
                        searchStatus? "Record Found":
                        "Check Availability"
                    }
                </button>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Tax Class
                </label>
                <div className="mt-2 flex-1">
                    <input
                    type="text"
                    name="taxClass"
                    id="taxClass"
                    autoComplete="family-name"
                    placeholder="Vehicle Tax Class"
                    onChange={handleChange}
                    value={vehicleData["taxClass"] || ""}
                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
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
                    value={vehicleData["make"] || ""}
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
                    value={vehicleData["model"] || ""}
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
                        id="YearManufacture"
                        name="YearManufacture"
                        onChange={handleChange}
                        value={vehicleData["YearManufacture"] || ""}
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                    >
                        <option className="font-bold text-gray-600">{vehicleData["YearManufacture"] ||"Select Year"}</option>
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
                    Vehicle Use
                </label>
                <div className="mt-2 flex-1">
                    <select
                        id="usage"
                        name="usage"
                        onChange={handleChange}
                        value={vehicleData["usage"] || ""}
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                    >
                        <option className="font-bold text-gray-600">{vehicleData["usage"] ||"Select Usage"}</option>
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
                        value={vehicleData["vehicleType"] || ""}
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                    >
                        <option className="font-bold text-gray-600">{vehicleData["vehicleType"] || "Select Vehicle Type"}</option>
                        <option value="Motor Bike">Motor Bike</option>
                        <option value="Motor">Motor</option>
                        <option value="Minibus">Minibus</option>
                        <option value="Bus">Bus</option>
                        <option value="Truck">Truck</option>
                    </select>
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