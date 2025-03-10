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
        setSearchStatus(false)
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
            <div className="flex w-full items-center justify-between rounded-full border border-gray-400 gap-2 relative">
                <div className="z-10 flex rounded-full p-1 px-2 border-r border-gray-400 bg-blue-500 text-white pr-10">
                    <label htmlFor="VRN" className="bg-inherit rounded-xs cursor-pointer pl-2">
                        Registration Number
                    </label>
                </div>
                <input
                    type="text"
                    name="VRN"
                    id="VRN"
                    autoComplete="family-name"
                    placeholder="Registration Number"
                    onChange={handleChange}
                    value={vehicleData["VRN"] || ""}
                    className="uppercase text-gray-700 pl-5 absolute right-32 left-44 z-20 h-full w-[calc(100%-320px)] -translate-x-[5px] rounded-full p-1 px-2 border border-blue-500 bg-white"
                />
                <div
                    className={`pl-14 w-48 z-10 flex rounded-full p-1 px-2 border-r border-gray-400 cursor-pointer shadow-[0_0_10px_0_rgba(0,0,0,0.8)] text-white ${searchStatus ? "bg-green-500" : "bg-blue-500"}`}
                    onClick={vehicleTPIQuote}
                >
                    {loading ? (
                    <>
                        Checking
                        <PulseLoader
                        color={"#fff"}
                        loading={loading}
                        cssOverride={override}
                        size={3}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        />
                    </>
                    ) : searchStatus ? (
                    "Record Found"
                    ) : (
                    "Check Availability"
                    )}
                </div>
            </div>
            <div className="flex-col space-y-2 mt-2">
                <div className="flex w-full items-center justify-between rounded-full border border-gray-400 gap-2 relative">
                    <div className="z-10 flex rounded-full p-1 px-2 border-r border-gray-400 bg-blue-500 text-white pr-10 w-56">
                        <label htmlFor="Tax_class" className="bg-inherit rounded-xs cursor-pointer pl-2">
                            Tax class
                        </label>
                    </div>
                    <p
                        id='Tax_class'
                        className="uppercase text-gray-700 pl-5 absolute right-32 left-44 z-20 h-full w-[calc(100%-170px)] -translate-x-[5px] rounded-full p-1 px-2 border border-blue-500 bg-white"
                    >
                        {vehicleData.taxClass}
                    </p>
                </div>
                <div className="flex w-full items-center justify-between rounded-full border border-gray-400 gap-2 relative">
                    <div className="z-10 flex rounded-full p-1 px-2 border-r border-gray-400 bg-blue-500 text-white pr-10 w-56">
                        <label htmlFor="Tax_class" className="bg-inherit rounded-xs cursor-pointer pl-2">
                            Make & Model
                        </label>
                    </div>
                    <p
                        id='Tax_class'
                        className="uppercase text-gray-700 pl-5 absolute right-32 left-44 z-20 h-full w-[calc(100%-170px)] -translate-x-[5px] rounded-full p-1 px-2 border border-blue-500 bg-white"
                    >
                        {vehicleData.make} {vehicleData.model}
                    </p>
                </div>
                <div className="flex w-full items-center justify-between rounded-full border border-gray-400 gap-2 relative">
                    <div className="z-10 flex rounded-full p-1 px-2 border-r border-gray-400 bg-blue-500 text-white pr-10 w-56">
                        <label htmlFor="Tax_class" className="bg-inherit rounded-xs cursor-pointer pl-2">
                            Year of Manufacture
                        </label>
                    </div>
                    <p
                        id='Tax_class'
                        className="uppercase text-gray-700 pl-5 absolute right-32 left-44 z-20 h-full w-[calc(100%-170px)] -translate-x-[5px] rounded-full p-1 px-2 border border-blue-500 bg-white"
                    >
                        {vehicleData.YearManufacture}
                    </p>
                </div>
                <div className="flex w-full items-center justify-between rounded-full border border-gray-400 gap-2 relative">
                    <div className="z-10 flex rounded-full p-1 px-2 border-r border-gray-400 bg-blue-500 text-white pr-10 w-56">
                        <label htmlFor="Tax_class" className="bg-inherit rounded-xs cursor-pointer pl-2">
                            Usage
                        </label>
                    </div>
                    <p
                        id='Tax_class'
                        className="uppercase text-gray-700 pl-5 absolute right-32 left-44 z-20 h-full w-[calc(100%-170px)] -translate-x-[5px] rounded-full p-1 px-2 border border-blue-500 bg-white"
                    >
                        {vehicleData.usage}
                    </p>
                </div>
                <div className="flex w-full items-center justify-between rounded-full border border-gray-400 gap-2 relative">
                    <div className="z-10 flex rounded-full p-1 px-2 border-r border-gray-400 bg-blue-500 text-white pr-10 w-56">
                        <label htmlFor="Tax_class" className="bg-inherit rounded-xs cursor-pointer pl-2">
                            Usage
                        </label>
                    </div>
                    <p
                        id='Tax_class'
                        className="uppercase text-gray-700 pl-5 absolute right-32 left-44 z-20 h-full w-[calc(100%-170px)] -translate-x-[5px] rounded-full p-1 px-2 border border-blue-500 bg-white"
                    >
                        {vehicleData.vehicleType}
                    </p>
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