import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CircleLoader, ClockLoader, HashLoader, PacmanLoader, PulseLoader, RingLoader, SyncLoader } from 'react-spinners';
import BeatLoader from "react-spinners/BeatLoader";
import { getCategories } from '../../../store/category-store';
import { fetchAsyncVehicleClasses, getVehicleClasses, updateVehicleInsurance } from '../../../store/vehicle-store';
import { fetchAsyncInsurer, getInsurers } from '../../../store/insurer-store';
import { fetchAsyncPolicy, getPolicies } from '../../../store/policy-store';
import Modal from '../../modal/Modal';

const userRole = localStorage.getItem('role')
const companyId = localStorage.getItem('companyId')

export default function TravelInsuranceModal(props) {

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(fetchAsyncInsurer())
        .then((response)=>{
            
        })
        dispatch(fetchAsyncPolicy())
        .then((response)=>{

        })
        dispatch(fetchAsyncVehicleClasses())
        .then((response)=>{

        })
    },[])

    const [productName, setInsuranceName] = useState("");
    const [policyState, setPolicyState] = useState(props.data.policyTypeName);
    const [description, setDescription] = useState("");
    const [insurancePrice, setInsurancePrice] = useState("");
    const [insurerId, setInsurerId] = useState("");
    const [policyTypeId, setPolicyTypeId] = useState(0);
    const [vehicleClassId, setVehicleClassId] = useState(0);
    const [isActive, setIsActive] = useState(0);
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [close, setClose] = useState(false)

    const categories = useSelector(getCategories)
    const policies = useSelector(getPolicies)
    const insurers = useSelector(getInsurers)
    const classes = useSelector(getVehicleClasses)

    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(1)
    
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

    const handleInputChange = (e, index) => {
        const updatedRows = [...rows];
        updatedRows[index] = e.target.value;
        setRows(updatedRows);
        console.log("rows ", rows)
    };

    const handleSubmit = async (e) => {
        e.preventDefault()        
        setLoading(true)
        if(companyId!==""){
            setInsurerId(companyId)
        }
        dispatch(updateVehicleInsurance({
            id: props.data.insuranceId,
            data:{
                policyTypeId,
                insurerId,
                insuranceTerm: 1,
                vehicleClassId,
                description,
                insurancePrice,
                isActive
            }
        }))
        .then((response)=>{
            console.log("Post response: ", response)
            if(response.payload&&response.payload.success){
                setSuccess(true)
            }
            else{
                setFailed(true)
            }            
        })
        .finally(()=>{
            setTimeout(()=>{
                setLoading(false)
                setFailed(false)
                setSuccess(false)
                props.setModal(close)
            },1000)
        })
    }

    const getModal =(isOpen)=>{
        props.setModal(isOpen)
    }

    return (
        <Modal setModal={getModal}>
            <h2 className="text-lg font-semibold">Insurance Creation Form</h2>
            <p className="text-xs mb-4">For vehicle Insurance processing</p>
            <div className='space-y-1'>
                <div className={`flex flex-col flex-1 justify-center py-3 ${!loading&&' hidden'}`}>
                    <HashLoader
                        color={loading&&failed&&!success?'#DF3333':'#3B82F6'}
                        loading={loading}
                        cssOverride={override}
                        size={30} // Adjust the size as needed
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                    {
                        loading&&!failed&&!success?<h1 className='flex text-blue-500 justify-center italic'>Loading</h1>:
                        loading&&failed&&!success?<h1 className='flex text-red-500 justify-center italic'>Failed</h1>:
                        loading&&!failed&&success&&<h1 className='flex text-gray-500 justify-center italic'>Success</h1>
                    }                            
                </div>
                <div className="sm:col-span-3 flex items-center">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Policy Type
                    </label>
                    <div className="mt-2 flex-1">
                        <select
                            id="insuranceType"
                            name="insuranceType"
                            className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        >
                            <option value="Option 0">Select Policy Type</option>
                            {
                                policies?policies.map((policy, index)=>(
                                    <option key={index} onClick={(e)=>setPolicyTypeId(policy.policyTypeId)}>{policy.policyTypeName}</option>
                                )):<option value="Option 0">No data found</option>
                            }
                        </select>
                    </div>
                </div>
                <div className="sm:col-span-3 flex items-center">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Vehicle Class
                    </label>
                    <div className="mt-2 flex-1">
                        <select
                            id="vehicleClass"
                            name="vehicleClass"
                            className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        >
                            <option value="Option 0">Select Vehicle Class</option>
                            {
                                classes?classes.map((item, index)=>(
                                    <option key={index} onClick={(e)=>setVehicleClassId(item.vehicleClassId)}>{item.class_name}</option>
                                )):<option value="Option 0">No data found</option>
                            }
                        </select>
                    </div>
                </div>
                <div className="sm:col-span-3 flex items-center">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Description
                    </label>
                    <div className="mt-2 flex-1">
                        <input
                            type="text"
                            name="description"
                            id="description"
                            autoComplete="family-name"
                            placeholder={props.data.description}
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                {
                    userRole === "ADMIN" && 
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Insurance Company
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="insurerId"
                                name="insurerId"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value="Option 0">Insurance Company</option>
                                {
                                    insurers?insurers.map((insurer, index)=>(
                                        <option key={index} onClick={(e)=>setInsurerId(insurer.insurerId)}>{insurer.insurerName}</option>
                                    )):<option value="Option 0">No data found</option>
                                }
                            </select>
                        </div>
                    </div>
                }
                <div className="sm:col-span-3 flex items-center">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Price
                    </label>
                    <div className="mt-2 flex-1">
                        <input
                            type="text"
                            name="insurancePrice"
                            id="insurancePrice"
                            autoComplete="family-name"
                            placeholder={props.data.insurancePrice}
                            value={insurancePrice}
                            onChange={(e)=>setInsurancePrice(e.target.value)}
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                {/* {[...Array(count)].map((_, index) => (
                    <div key={index} className="sm:col-span-3 flex items-center">
                    <label htmlFor={`add-on-${index}`} className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Add On {++index}
                    </label>
                    <div className="mt-2 flex flex-1">
                        <input
                            type="text"
                            name={`add-on-${--index}`}
                            id={`add-on-${index}`}
                            autoComplete="family-name"
                            placeholder={`${index===0?"Add On":"Optional Add On"}`}
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            value={rows[index]}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                    </div>
                    {index === count - 1 ? 
                        (<span onClick={increment} className="fas fa-plus px-3" />):(<span onClick={() => decrement(index)} className="fas fa-minus px-3" />)}
                    </div>
                ))} */}
                <div className="sm:col-span-3 flex items-center">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Active State
                    </label>
                    <div className="mt-2 flex-1">
                        <select
                            id="systemAdOns"
                            name="systemAdOns"
                            className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        >
                            <option value="">{props.data.isActive?"Active":"Inactive"}</option>
                            <option onClick={()=>setIsActive(true)}>Active</option>
                            <option onClick={()=>setIsActive(false)}>Inactive</option>
                        </select>
                    </div>
                </div>
                
            </div>
            <div className='flex space-x-2 pt-10'>
                <button
                    onClick={handleSubmit}
                    className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                >
                Submit
                </button>
                <button
                    onClick={()=>props.setModal(isOpen)}
                    className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                >
                Cancel
                </button>
            </div>
        </Modal>
    )
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}
