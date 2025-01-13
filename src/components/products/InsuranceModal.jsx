import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { CircleLoader, ClockLoader, PacmanLoader, PulseLoader, RingLoader, SyncLoader } from 'react-spinners';
import BeatLoader from "react-spinners/BeatLoader";
import { getCategories } from '../../store/category-store';

export default function InsuranceModal(props) {

    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [price, setPrice] = useState("");
    const [productCategoryId, setProductCategoryId] = useState(0);
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const categories = useSelector(getCategories)

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
        dispatch(postInsurance({
            productName,
            price,
            productCategoryId,
            insurerId: 2,
            isActive: false
        }))
        .then((response)=>{
            // console.log("Post response: ", response.payload.data.data.productId)
            if(response.payload&&response.payload.success){
                if(rows.length>0){
                    rows.map((addon, i)=>{
                        submitProductAddOns({description:addon, productId: response.payload.data.data.productId})
                    })
                    console.log("2 values are: ", rows.length, " and ", addOnSuccess)
                    if(rows.length+1===addOnSuccess){
                        setSuccess(true)
                    }
                    else{
                        setFailed(true)
                    }
                }
                else{
                    setSuccess(true)
                }
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
                setProductName('')
                setPrice('')
                setProductDescription('')
                setProductCategoryId(0)
                setAddOnSuccess(1)
            },5000)
        })
    }

    const submitProductAddOns = ({description, productId}) => {
        dispatch(postAddOn({
            description,
            statusCode: "ACTIVE",
            productId
        }))
        .then((response)=>{
            console.log("Post Add response: ", response.payload)
            if(response.payload&&response.payload.success){
                setAddOnSuccess(addOnSuccess + 1)
                console.log("new success value ", addOnSuccess)
            }
        })
    }

    return (
        <div className='flex flex-col flex-1 h-screen justify-center bg-gray-200 bg-opacity-50 items-center fixed inset-0 z-50 top-0 left-0' onClick={() => props.setModal(isOpen)}>
            <div className='flex flex-col w-1/2 justify-center bg-white p-8 rounded-lg border border-gray-200' onClick={(e) => e.stopPropagation()}>
                <div className='w-full flex justify-end'>
                    <a 
                        href="#"
                        onClick={() => props.setModal(isOpen)}
                    >
                        <i className='fas fa-times text-black'/>
                    </a>
                </div>
                <h2 className="text-lg font-semibold">Insurance Creation Form</h2>
                <p className="text-xs mb-4">For vehicle Insurance processing</p>
                <div className='space-y-1'>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Policy Name
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="productName"
                                id="productName"
                                autoComplete="family-name"
                                placeholder='Insurance Name'
                                value={productName}
                                onChange={(e)=>setProductName(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
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
                                placeholder='Description'
                                value={productDescription}
                                onChange={(e)=>setProductDescription(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Term
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value="">Select an option</option>
                                <option value="Option 1">Daily</option>
                                <option value="Option 2">Weekly</option>
                                <option value="Option 3">Monthly</option>
                                <option value="Option 3">Quarterly</option>
                                <option value="Option 3">Yearly</option>
                            </select>
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Price
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="price"
                                id="price"
                                autoComplete="family-name"
                                placeholder='Price'
                                value={price}
                                onChange={(e)=>setPrice(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
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
                                    categories?categories.map((category, index)=>(
                                        <option key={index} onClick={(e)=>setProductCategoryId(category.id)}>{category.description}</option>
                                    )):<option value="Option 0">No data found</option>
                                }
                            </select>
                        </div>
                    </div>
                    {[...Array(count)].map((_, index) => (
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
                    ))}
                    
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
            </div>
        </div>
    )
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}
