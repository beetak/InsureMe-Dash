import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCategories } from '../../store/category-store'
import { postAddOn } from '../../store/addon-store';
import { postInsurance } from '../../store/product-store';
import PageLoading from '../loadingStates/PageLoading';
import { fetchAsyncInsurer, getInsurers } from '../../store/insurer-store';

const userRole = localStorage.getItem('role')

export default function InsuranceForm() {

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(fetchAsyncInsurer())
    },[])

    const categories = useSelector(getCategories)
    const insurers = useSelector(getInsurers)

    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("description");
    const [price, setPrice] = useState("");
    const [productCategoryId, setProductCategoryId] = useState(0);
    const [insurerId, setInsurerId] = useState(0);
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [addOnSuccess, setAddOnSuccess] = useState(1)
    const [error, setError] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(productName===""&&productDescription===""&&price===""&&productCategoryId===0){
            const newError = { err: 'empty', message: 'Please provide all fields' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
        }
        else {
            // if(productName===""){
            //     const newError = { err: 'product', message: 'Please provide the product name' };
            //     setError(prevError => [...prevError, newError]);
            //     setTimeout(() => {
            //         setError(prevError => prevError.filter(error => error !== newError));
            //     }, 2000);
            // }
            if(productDescription===""){
                const newError = { err: 'description', message: 'Please provide the product description' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(price===""){
                const newError = { err: 'price', message: 'Please provide the price' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            // if(productCategoryId===0){
            //     const newError = { err: 'category', message: 'Please select a category' };
            //     setError(prevError => [...prevError, newError]);
            //     setTimeout(() => {
            //         setError(prevError => prevError.filter(error => error !== newError));
            //     }, 2000);
            // }
            else if(productDescription!==""&&price!==""){
                setLoading(true)
                dispatch(postInsurance({
                    productName,
                    price,
                    productCategoryId,
                    insurerId: 1,
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
                        }
                        else{
                            setFailed(true)
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
        }
    }

    const submitProductAddOns = ({description, productId}) => {
        dispatch(postAddOn({
            description,
            isActive: true,
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

    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                {
                    loading && <PageLoading loading={loading} failed={failed} success={success} addOnSuccess={addOnSuccess}/> 
                } 
                <h2 className="text-lg font-semibold">Insurance Creation Form</h2>
                <p className="text-xs mb-4">For vehicle Insurance processing</p>
                <div className='space-y-1'>
                    {
                        Object.keys(error).length>0&&
                        error.map((error, index) => {
                            if (error.err === "empty") {
                                return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                            }
                            return null;
                        })
                    }
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Policy Type
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "category") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <select
                                id="insuranceType"
                                name="insuranceType"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value="Option 0">Select Policy Type</option>
                                {
                                    categories?categories.map((category, index)=>(
                                        <option key={index} onClick={(e)=>setProductCategoryId(category.id)}>{category.categoryName}</option>
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
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "description") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
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
                    {
                        userRole === "ADMIN" && 
                        <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                                Insurance Company
                            </label>
                            <div className="mt-2 flex-1">
                                {
                                    Object.keys(error).length>0&&
                                    error.map((error, index) => {
                                        if (error.err === "description") {
                                            return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                        }
                                        return null;
                                    })
                                }
                                <select
                                    id="insuranceType"
                                    name="insuranceType"
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                >
                                    <option disabled value="Option 0">Insurance Company</option>
                                    {
                                        insurers?insurers.map((insurer, index)=>(
                                            <option key={index} onClick={(e)=>setInsurerId(insurer.id)}>{insurer.insurerName}</option>
                                        )):<option value="Option 0">No data found</option>
                                    }
                                </select>
                            </div>
                        </div>
                    }
                   
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
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Cancel
                    </button>
                </div>
            </div>
        </>
    )
}
