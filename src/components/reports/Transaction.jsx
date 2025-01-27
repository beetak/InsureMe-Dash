import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { useLocation } from 'react-router-dom'
import { ScaleLoader } from 'react-spinners'
import CategoryModal from '../category/CategoryModal'
import CategoryViewModal from '../category/CategoryViewModal'
import InsuranceApi, { setupInterceptors } from '../api/InsuranceApi'
import useAuth from '../../hooks/useAuth'
import Motor from './TransactionalReport/Motor'
import Property from './TransactionalReport/Property'
import Travel from './TransactionalReport/Travel'

export default function Transaction() {
    const { user, setUser } = useAuth()
    const location = useLocation()

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('Enter reference ID and click search')
    const [isOpen, setIsOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [sales, setSales] = useState(null)
    const [referenceId, setReferenceId] = useState("")

    useEffect(() => {
        setupInterceptors(() => user, setUser)
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const refId = params.get('referenceId')
        if (refId) {
            setReferenceId(refId)
            handleSearch(refId)
        }
    }, [location])

    const handleSearch = async (searchRefId = referenceId) => {
        setLoading(true);
        setMessage("Loading, Please wait a moment");
        
        try {
            const response = await InsuranceApi.get(`/product-payments/by-reference-number?referenceNumber=${searchRefId}`);
            
            if (response.data.code === "OK") {
                if (response.data.data.length > 0) {
                    console.log(response.data.data[0].transactionDescription)
                    const transactionDescriptionString = response.data.data[0].transactionDescription;
    
                    try {
                        const transactionDescription = JSON.parse(transactionDescriptionString);
                        response.data.data[0].transactionDescription = transactionDescription;
                        
                    } catch (parseError) {
                        console.error("Error parsing transactionDescription:", parseError);
                        response.data.data[0].transactionDescription = {};
                        setMessage("Error parsing transaction description");
                    }
                    
                    setSales(response.data.data[0]);
                    setMessage(""); // Clear message on success
                } else {
                    setSales(null);
                    setMessage("No sales record found");
                }
            } else {
                setSales(null);
                setMessage("Error Fetching Resource");
            }
        } catch (err) {
            console.error("Error fetching resource:", err)
            setSales(null);
            setMessage("Error Fetching Resource");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setReferenceId(e.target.value)
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    const loadingAnimation = () => {
        return (
            <div className='flex justify-center'>
                <span style={{ textAlign: 'center' }} className='py-3'>
                    <ScaleLoader
                        color='#374151'
                        loading={loading}
                        cssOverride={override}
                        size={10}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                    <h1 className='flex text-gray-700 justify-center'>{message}</h1>
                </span>
            </div>
        )
    }

    function renderTransactionItems() {
        
        if (sales?.insuranceCategory === 'MOTOR_VEHICLE') {
            return <Motor sales={sales}/>
        }
        else if(sales?.insuranceCategory === 'TRAVEL') {
            return <Travel sales={sales}/>
        }
        else if(sales?.insuranceCategory === 'PROPERTY') {
            return <Property sales={sales}/>
        }
        else{
            return (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="flex flex-col">
                        <div className="bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
                            <div className="flex justify-center items-center bg-gray-700 text-white">
                                <span className="font-semibold">No transaction details found</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
            <h2 className="text-lg font-semibold">Transaction Report</h2>
            <div className='flex justify-between py-4'>
                <div className="xl:col-span-3 flex items-center space-x-2">
                    <div className="flex items-center justify-between rounded-full border border-gray-400 mr-1"> 
                        <div className="flex p-1 px-2">
                            <input
                                type="text"
                                name="referenceId"
                                id="referenceId"
                                value={referenceId}
                                autoComplete="off"
                                placeholder='Transaction Reference'
                                onChange={handleInputChange}
                                className="block w-full rounded-xs border-0 px-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-0 bg-gray-200 rounded-full outline-none sm:text-sm sm:leading-6"
                                aria-label="Transaction Reference ID"
                            />
                        </div>                                
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className='w-full justify-center flex items-center'>
                        <div className='md:flex-col md:justify-center'>
                            <button
                                onClick={() => handleSearch()}
                                className="space-x-2 border-gray-300 rounded-l-full px-3 h-8 items-center bg-blue-500 text-gray-100 hover:bg-blue-600"
                                aria-label="Search"
                            >
                                <i className='fas fa-search text-xs'/>
                                <span className='text-xs'>Search</span>
                            </button>
                            <button
                                onClick={() => {
                                    setModalData(sales)
                                    setIsOpen(true)
                                }}
                                className="space-x-2 border-gray-300 rounded-r-full px-3 h-8 items-center bg-gray-500 text-gray-100 hover:bg-gray-600"
                                aria-label="Print"
                                disabled={!sales}
                            >
                                <i className='fas fa-print text-xs'/>
                                <span className='text-xs'>Print</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {loading ? (
                loadingAnimation()
            ) : (
                <>
    
                    {sales ? (
                        <>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-2">
                                <div className="flex flex-col">
                                    <div className="bg-gray-300 text-gray-700 py-3 px-6">
                                        <div className="flex justify-between items-center">
                                            <div className='flex flex-col'>
                                                <span className="font-semibold">Total Paid</span>
                                                <span className="font-semibold">Transaction Reference Number</span>
                                            </div>
                                            <div className='flex flex-col items-end'>
                                                <span className="font-semibold">
                                                    {formatCurrency(sales.amount)}
                                                </span>
                                                <span className="font-semibold">
                                                    {sales.referenceNumber}
                                                </span>
                                            </div>                                
                                        </div>
                                    </div>
                                </div>
                            </div>                     
                            {renderTransactionItems()}
                        </>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="flex flex-col">
                                <div className="bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
                                    <div className="flex justify-center items-center bg-gray-700 text-white">
                                        <span className="font-semibold">{message}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}

