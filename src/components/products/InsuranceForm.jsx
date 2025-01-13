import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCategories } from '../../store/category-store'
import { postAddOn } from '../../store/addon-store';
import { postInsurance } from '../../store/product-store';
import PageLoading from '../loadingStates/PageLoading';
import { fetchAsyncInsurer, getInsurers } from '../../store/insurer-store';
import WatermarkedFormContainer from './WatermarkedFormContainer';

const userRole = localStorage.getItem('role')

export default function InsuranceForm() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAsyncInsurer())
    }, [dispatch])

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
    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(1)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (productName === "" && productDescription === "" && price === "" && productCategoryId === 0) {
            const newError = { err: 'empty', message: 'Please provide all fields' };
            setError(prevError => [...prevError, newError]);
            setTimeout(() => {
                setError(prevError => prevError.filter(error => error !== newError));
            }, 2000);
        } else {
            if (productDescription === "") {
                const newError = { err: 'description', message: 'Please provide the product description' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if (price === "") {
                const newError = { err: 'price', message: 'Please provide the price' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            else if (productDescription !== "" && price !== "") {
                setLoading(true)
                dispatch(postInsurance({
                    productName,
                    price,
                    productCategoryId,
                    insurerId: 1,
                    isActive: false
                }))
                .then((response) => {
                    if (response.payload && response.payload.success) {
                        if (rows.length > 0) {
                            rows.forEach((addon) => {
                                submitProductAddOns({description: addon, productId: response.payload.data.data.productId})
                            })
                            if (rows.length + 1 === addOnSuccess) {
                                setSuccess(true)
                            }
                        } else {
                            setFailed(true)
                        }
                    } else {
                        setFailed(true)
                    }            
                })
                .finally(() => {
                    setTimeout(() => {
                        setLoading(false)
                        setFailed(false)
                        setSuccess(false)
                        setProductName('')
                        setPrice('')
                        setProductDescription('')
                        setProductCategoryId(0)
                        setAddOnSuccess(1)
                    }, 5000)
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
        .then((response) => {
            if (response.payload && response.payload.success) {
                setAddOnSuccess(prevSuccess => prevSuccess + 1)
            }
        })
    }

    const decrement = (index) => {
        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows.splice(index, 1);
          return updatedRows;
        });
        setCount((prevCount) => prevCount - 1);
    };

    const increment = () => {
        setCount(prevCount => prevCount + 1)
    }

    const handleInputChange = (e, index) => {
        const updatedRows = [...rows];
        updatedRows[index] = e.target.value;
        setRows(updatedRows);
    };

    return (
        <WatermarkedFormContainer watermarkSrc="images/FBC.png?height=200&width=200">
            {loading && <PageLoading loading={loading} failed={failed} success={success} addOnSuccess={addOnSuccess} />}
            <h2 className="text-lg font-semibold">Insurance Creation Form</h2>
            <p className="text-xs mb-4">For vehicle Insurance processing</p>
            <div className='space-y-4'>
                {error.length > 0 && error.map((err, index) => (
                    err.err === "empty" && (
                        <h6 key={index} className='text-red-500 text-sm'>{err.message}</h6>
                    )
                ))}
                <div className="flex items-center">
                    <label htmlFor="insuranceType" className="block text-sm font-medium text-gray-900 w-1/6">
                        Policy Type
                    </label>
                    <div className="flex-1">
                        {error.length > 0 && error.map((err, index) => (
                            err.err === "category" && (
                                <h6 key={index} className='text-red-500 text-sm mb-1'>{err.message}</h6>
                            )
                        ))}
                        <select
                            id="insuranceType"
                            name="insuranceType"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onChange={(e) => setProductCategoryId(Number(e.target.value))}
                        >
                            <option value="0">Select Policy Type</option>
                            {categories ? categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.categoryName}</option>
                            )) : <option value="0">No data found</option>}
                        </select>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-900 w-1/6">
                        Description
                    </label>
                    <div className="flex-1">
                        {error.length > 0 && error.map((err, index) => (
                            err.err === "description" && (
                                <h6 key={index} className='text-red-500 text-sm mb-1'>{err.message}</h6>
                            )
                        ))}
                        <input
                            type="text"
                            name="description"
                            id="description"
                            placeholder='Description'
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            className="w-full rounded border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
                {userRole === "ADMIN" && (
                    <div className="flex items-center">
                        <label htmlFor="insuranceCompany" className="block text-sm font-medium text-gray-900 w-1/6">
                            Insurance Company
                        </label>
                        <div className="flex-1">
                            <select
                                id="insuranceCompany"
                                name="insuranceCompany"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onChange={(e) => setInsurerId(Number(e.target.value))}
                            >
                                <option value="0">Insurance Company</option>
                                {insurers ? insurers.map((insurer) => (
                                    <option key={insurer.id} value={insurer.id}>{insurer.insurerName}</option>
                                )) : <option value="0">No data found</option>}
                            </select>
                        </div>
                    </div>
                )}
               
                {[...Array(count)].map((_, index) => (
                    <div key={index} className="flex items-center">
                        <label htmlFor={`add-on-${index}`} className="block text-sm font-medium text-gray-900 w-1/6">
                            Add On {index + 1}
                        </label>
                        <div className="flex flex-1 items-center">
                            <input
                                type="text"
                                name={`add-on-${index}`}
                                id={`add-on-${index}`}
                                placeholder={index === 0 ? "Add On" : "Optional Add On"}
                                className="flex-1 rounded border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={rows[index] || ''}
                                onChange={(e) => handleInputChange(e, index)}
                            />
                            {index === count - 1 ? (
                                <button onClick={increment} className="ml-2 text-blue-500 hover:text-blue-700">
                                    <i className="fas fa-plus" />
                                </button>
                            ) : (
                                <button onClick={() => decrement(index)} className="ml-2 text-red-500 hover:text-red-700">
                                    <i className="fas fa-minus" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                
            </div>
            <div className='flex space-x-4 mt-8'>
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Submit
                </button>
                <button
                    className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                    Cancel
                </button>
            </div>
        </WatermarkedFormContainer>
    )
}

