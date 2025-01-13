import React, { useEffect, useState } from 'react'
import { fetchAsyncPolicy, getPolicies } from '../../../store/policy-store'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-datepicker';
import CountryDropdown from '../../CountryDropdown';
import PassportUploadModal from './PassportUploadModal';
import SearchableDropdown from '../../SearchableDropdown';
import MultipleSelect from '../../MultipleSelect';

export default function TravelDetails({ onChange }) {

    const dispatch = useDispatch()
    
    const [travelData, setTravelData] = useState([])
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setTravelData({...travelData, [name] : value})
    }

    useEffect(()=>{
        dispatch(fetchAsyncPolicy())
    },[])

    const [policyDetails, setPolicyDetails] = useState({
        zbcCategory,
        vehicleClass,
        zbcTerm,
        zinaraTerm,
        insuranceType,
        insuranceTerm,
    });

    const decrement = (index) => {
        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows.splice(index, 1);
          return updatedRows;
        });
        setCount((prevCount) => prevCount - 1);
    };

    const increment = () => {
        setCount(prevCount=>prevCount+1)
    }

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setPolicyDetails((prevDetails) => ({
          ...prevDetails,
          [name]: checked,
        }));
    };

    const handleZbc = () =>{
        setZbcActive(!zbcActive)
    }
    const handleZinara = () =>{
        setZinaraActive(!zinaraActive)
    }

    const policies = useSelector(getPolicies)

    const calculatedDuration = () => {
        if(!startDate && !endDate){
            return 0
        }

        if(startDate>endDate){
            return "Invalid"
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
    
        // Calculate the difference in milliseconds
        const differenceInTime = end - start;

        // Convert milliseconds to days
        const differenceInDays = differenceInTime / (1000 * 3600 * 24) +1;
        
        return Math.ceil(differenceInDays); // Use Math.ceil if you want to round up
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
            {/* <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Coverage
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="text"
                        name="coverage"
                        id="coverage"
                        autoComplete="family-name"
                        placeholder="Coverage"
                        onChange={handleChange}
                        // value={vehicleInfo?vehicleInfo.vehicleMake:vehicleDetails.vehicleMake}
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div> */}
            {/* <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Ailments
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="text"
                        name="ailments"
                        id="ailments"
                        autoComplete="family-name"
                        placeholder="Ailments"
                        onChange={handleChange}
                        // value={vehicleInfo?vehicleInfo.vehicleMake:vehicleDetails.vehicleMake}
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div> */}
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Residence Country
                </label>
                {/* <CountryDropdown placeholderText="Residence Country"/> */}
                <SearchableDropdown placeholderText="Residence Country"/>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Destination Country
                </label>
                {/* <CountryDropdown placeholderText="Destination Country"/> */}
                <SearchableDropdown placeholderText="Destination Country"/>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Travel Duration
                </label>
                <div className="grid grid-cols-3 items-center justify-between border border-gray-300 gap-2 mt-2 flex-1">
                    <div className="flex p-1 px-2 border-r border-gray-300">
                        <h6 className='mr-3'>Depature Date:</h6>
                        <DatePicker
                            showPopperArrow
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            minDate={new Date()}
                            className='w-[105px] outline-none rounded-3xl bg-gray-200 px-3 cursor-pointer'
                        />
                    </div>
                    <div className="flex p-1 px-2 border-r border-gray-300">
                        <h6 className='mr-3'>Return Date:</h6>
                        <DatePicker
                            showPopperArrow
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            minDate={new Date()}
                            className='w-[105px] outline-none rounded-3xl bg-gray-200 px-3 cursor-pointer'
                        />
                    </div>
                    <div className="flex p-1 px-2">
                        <p>Duration: <span>{calculatedDuration()} Days</span></p>
                    </div>
                </div>
            </div>
            {[...Array(count)].map((_, index) => (
                <div key={index} className="sm:col-span-3 flex items-center mt-2">
                    <label htmlFor={`address-${index}`} className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Child {++index}
                    </label>
                    <div className="block flex-1">
                        {
                            index===1&&Object.keys(error).length>0&&
                            error.map((error, index) => {
                                if (error.err === "address") {
                                    return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                }
                                return null;
                            })
                        }
                        <div className="grid grid-cols-2 border border-gray-300 p-2">
                            <div className="flex items-center w-full mb-4 sm:mb-0 sm:mr-4">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                                    Fullname
                                </label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        autoComplete="given-name"
                                        placeholder="Fullname"
                                        onChange={handleChange}
                                        value={travelData[""]}
                                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center w-full ml-1">
                                <label htmlFor="surname" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                                    Surname
                                </label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="surname"
                                        id="surname"
                                        autoComplete="family-name"
                                        placeholder="Enter Surname"
                                        onChange={handleChange}
                                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center w-full mt-2">
                                <label htmlFor="surname" className="block text-sm font-medium leading-4 text-gray-900 w-1/4">
                                    Passport Number
                                </label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="passportNumber"
                                        id="passportNumber"
                                        autoComplete="family-name"
                                        placeholder="Enter Passport Number"
                                        onChange={handleChange}
                                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>                        
                    </div>
                    {
                        index === count ? (
                            count < 3 ? (
                                <span onClick={increment} className="fas fa-plus px-3" />
                            ) : (
                                <span className="fas fa-plus px-3 disabled" />
                            )
                            ) : (
                                <span onClick={() => decrement(index)} className="fas fa-minus px-3" />
                            )
                    }
                </div>
            ))}
            {/* <div className="sm:col-span-3 flex items-center">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Comments
                </label>
                <div className="mt-2 flex-1">
                <textarea
                    name="coverage"
                    id="coverage"
                    autoComplete="family-name"
                    placeholder="Enter the winter sports"
                    onChange={handleChange}
                    // value={vehicleInfo ? vehicleInfo.vehicleMake : vehicleDetails.vehicleMake}
                    variant="outlined"
                    className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    fullWidth
                />
                </div>
            </div> */}
        </>
    )
}

