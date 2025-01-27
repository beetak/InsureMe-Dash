import React, { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import CategoryModal from '../category/CategoryModal';
import CategoryViewModal from '../category/CategoryViewModal';
import { fetchTransaction } from '../../store/payments-store';

export default function Transact() {

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [referenceId, setReferenceId] = useState("")
    const [viewOpen, setViewOpen] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [transactionDetails, setTransactionDetails] = useState("")

    const dispatch = useDispatch()

    const handleSearch = () => {
        setLoading(true)
        setMessage("Processing...")
        dispatch(fetchTransaction({
            referenceId
        }))
        .then((response)=>{
            if(response.payload&&response.payload.success){
                setMessage("")
                setTransactionDetails(response.payload.data)
            }
            else{
                setLoading(true)
            }            
        })
        .finally(()=>{
            setLoading(false)
            setMessage("")
        })
    }

    const loadingAnimation = () => {
        return <div className='flex justify-center'>
            <span style={{ textAlign: 'center' }} className='py-3'>
                <ScaleLoader
                    color='#374151'
                    loading={loading}
                    cssOverride={override}
                    size={10} // Adjust the size as needed
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
                <h1 className='flex text-gray-700 justify-center'>{message}</h1>
            </span>
        </div>
    }

    const getModal =(isOpen)=>{
        setIsOpen(isOpen)
        // isOpen&&fetchCategoryData()
    }
    const getViewModal =(isOpen)=>{
        setViewOpen(isOpen)
    }

    function renderTransactionItems() {
        return (
            <>
                <div className="flex-col w-full py-1 text-sm">
                    <p className='text-sm'><span className='inline-block w-44'>Vehicle Registration: </span>AEO7358</p>
                    <p className='text-sm'><span className='inline-block w-44'>Make: </span>Baic (Grand Tiger)</p>
                    <p className='text-sm'><span className='inline-block w-44'>Engine Number: </span>987654321</p>
                    <p className='text-sm'><span className='inline-block w-44'>Year Of Manufacture: </span>2015</p>
                    <p className='text-sm'><span className='inline-block w-44'>Usage: </span>Transport</p>
                    <p className='text-sm'><span className='inline-block w-44'>Policy: </span>Road Traffic Act - $35.00</p>
                    <p className='text-sm'><span className='inline-block w-44'>Broker Name: </span>Sanctuary Insurance</p>
                </div>
            </>
        )
    }

    function renderAdOns() {
        return (
            <>
                <div className="flex w-full text-gray-700 font-bold">
                    ZINARA LICENCE
                </div>
                <div className="flex-col w-full text-sm">
                    <p className='text-sm'><span className='inline-block w-44'>Policy: </span>Not Defined</p>
                    <p className='text-sm'><span className='inline-block w-44'>Start Date: </span>Not Defined</p>
                    <p className='text-sm'><span className='inline-block w-44'>End Date: </span>Not Defined</p>
                </div>
                <div className="flex w-full text-gray-700 font-bold">
                    ZBC LICENCE
                </div>
                <div className="flex-col w-full text-sm">
                    <p className='text-sm'><span className='inline-block w-44'>Policy: </span>Not Defined</p>
                    <p className='text-sm'><span className='inline-block w-44'>Start Date: </span>Not Defined</p>
                    <p className='text-sm'><span className='inline-block w-44'>End Date: </span>Not Defined</p>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                {
                    isOpen&& <CategoryModal setModal={getModal} data={modalData}/>
                }
                {
                    viewOpen&& <CategoryViewModal setModal={getViewModal} data={modalData}/>
                }
                <h2 className="text-lg font-semibold">Transaction Report</h2>
                <div className='flex justify-between py-4'>
                    <div className="xl:col-span-3 flex items-center space-x-2">
                        <div className="flex items-center justify-between rounded-full border border-gray-400 mr-1"> 
                            <div className="flex p-1 px-2">
                                <input
                                    type="text"
                                    name="referenceId"
                                    id="referenceId"
                                    autoComplete="family-name"
                                    placeholder='Transaction Reference'
                                    onChange={(e)=>setReferenceId(e.target.value)}
                                    className="block w-full rounded-xs border-0 px-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-0 bg-gray-200 rounded-full outline-none sm:text-sm sm:leading-6"
                                />
                            </div>                                
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className='w-full justify-center flex items-center'>
                            <div className='md:flex-col md:justify-center'>
                                <button
                                    onClick={handleSearch}
                                    className={`space-x-2 border-gray-300 rounded-l-full px-3 h-8 items-center bg-blue-500 text-gray-100 hover:bg-blue-600`}
                                >
                                    <i className='fas fa-search text-xs'/>
                                    <span className='text-xs'>Search</span>
                                </button>
                                <button
                                    onClick={
                                        ()=>{
                                        setModalData(item)
                                        setIsOpen(true)
                                        }
                                    }
                                    className={`space-x-2 border-gray-300 rounded-r-full px-3 h-8 items-center bg-gray-500 text-gray-100 hover:bg-gray-600`}
                                >
                                    <i className='fas fa-print text-xs'/>
                                    <span className='text-xs'>Print</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {loading ? 
                    (
                        loadingAnimation()
                    ) : (
                        <>
                        {
                            transactionDetails.data&&
                            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-2">
                                <div className="flex flex-col">
                                    <div className=" bg-gray-300 text-gray-700  py-3 px-6">
                                        <div className="flex justify-between items-center">
                                            <div className='flex flex-col'>
                                                <span className="font-semibold">Total Paid</span>
                                                <span className="font-semibold">Transaction Reference Number</span>
                                                <span className="font-semibold">Client ID</span>
                                                <span className="font-semibold">Client Name</span>
                                            </div>
                                            <div className='flex flex-col items-end'>
                                                <span className="font-semibold">
                                                    {transactionDetails.data.amount.toLocaleString('en-US', {
                                                        style: 'currency',
                                                        currency: 'USD',
                                                    })}
                                                </span>
                                                <span className="font-semibold">
                                                    {transactionDetails.data.referenceNumber}
                                                </span>
                                            </div>                                
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
        
                        {
                            transactionDetails.data?
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="flex flex-col">
                                    <div className=" bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
                                        <div className="flex justify-between items-center bg-gray-700 text-white">
                                            <span className="font-semibold">Insurance Details</span>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4">
                                        <div className="space-y-4">
                                            {renderTransactionItems()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className=" bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
                                        <div className="flex justify-between items-center bg-gray-700 text-white">
                                            <span className="font-semibold">Ad Ons Details</span>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4">
                                    {loading ? (
                                        loadingAnimation()
                                    ) : (
                                        <div className="space-y-4">
                                        {renderAdOns()}
                                        </div>
                                    )}
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="flex flex-col">
                                    <div className=" bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
                                        <div className="flex justify-center items-center bg-gray-700 text-white">
                                            <span className="font-semibold">Enter Transaction Reference and click search</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        }
                        </>
                    )
                }
                
            </div>
        </>
    )
}

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
}