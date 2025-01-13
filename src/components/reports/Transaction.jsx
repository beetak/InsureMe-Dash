import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ScaleLoader } from 'react-spinners'
import CategoryModal from '../category/CategoryModal'
import CategoryViewModal from '../category/CategoryViewModal'
import InsuranceApi, { setupInterceptors } from '../api/InsuranceApi'
import useAuth from '../../hooks/useAuth'

export default function Transaction() {
    const { user, setUser } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

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
        setLoading(true)
        setMessage("Loading, Please wait a moment")
        try {
            const response = await InsuranceApi.get(`/product-payments/by-reference-number?referenceNumber=${searchRefId}`)
            if (response.data.code === "OK" && response.data.data.length > 0) {
                setSales(response.data.data[0])
                setMessage("")
            } else if (response.data.code === "NOT_FOUND") {
                setSales(null)
                setMessage("No sales record found")
            } else {
                setSales(null)
                setMessage("Error Fetching Resource")
            }
        } catch (err) {
            setSales(null)
            setMessage("Error Fetching Resource")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        setReferenceId(e.target.value)
        // Update URL when input changes
        // navigate(`/transaction?referenceId=${e.target.value}`, { replace: true })
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

    const getModal = (isOpen) => {
        setIsOpen(isOpen)
    }

    const getViewModal = (isOpen) => {
        setViewOpen(isOpen)
    }

    function renderTransactionItems() {
        if (!sales) return null

        return (
            <div className="overflow-x-auto bg-white rounded-lg">
                <table className="w-full divide-gray-200">
                    <thead className="bg-white border-b-2 border-gray-300">
                        <tr>
                            {['Insurance Category', 'Proposal Status', 'Amount', 'Payment Method', 'Date'].map((header) => (
                                <th
                                    key={header}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr
                            key={sales.id}
                            className="hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {sales.insuranceCategory}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    sales.paymentStatus === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {sales.paymentStatus}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatCurrency(sales.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {sales.paymentMethod}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(sales.paymentDate).toLocaleDateString()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
            {isOpen && <CategoryModal setModal={getModal} data={modalData} />}
            {viewOpen && <CategoryViewModal setModal={getViewModal} data={modalData} />}
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
                    {sales && (
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
                    )}
    
                    {sales ? (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="flex flex-col">
                                <div className="bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
                                    <div className="flex justify-between items-center bg-gray-700 text-white">
                                        <span className="font-semibold">Transaction Details</span>
                                    </div>
                                </div>
                                <div className="py-4">
                                    <div className="space-y-4">
                                        {renderTransactionItems()}
                                    </div>
                                </div>
                            </div>
                        </div>
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

