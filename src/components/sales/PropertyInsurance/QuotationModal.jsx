'use client'

import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { BarLoader } from 'react-spinners'
import { StepperContext } from '../../../context/StepperContext'
import InsuranceApi, {setupInterceptors} from '../../api/InsuranceApi'
import useAuth from '../../../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import CoverNotePrinter from './CoverNotePrinter'
import QuotationPrinter from './QuotationPrinter'
import EmailApi from '../../api/EmailApi'
import PaymentsApi from '../../api/PaymentsApi'

export default function QuotationModal({ setModal }) {

    const [ loading, setLoading] = useState(false)
    const [ statusMessage, setStatusMessage] = useState("")
    const [ insurers, setInsurers] = useState([])
    const [ quotations, setQuotations] = useState([])
    const [ paymentStates, setPaymentStates] = useState({})
    const [ paymentStatus, setPaymentStatus] = useState(false)
    const [ processingPayment, setProcessingPayment] = useState(false)
    const [ isSending, setIsSending ] = useState(false)
    const [ pollingMerchantRef, setPollingMerchantRef ] = useState(null)
    const [ paymentToken, setPaymentToken ] = useState({})

    const { propertyData, userData } = useContext(StepperContext)
    const { user, setUser } = useAuth()

    useEffect(()=>{
        setupInterceptors(() => user, setUser);
      },[])

    const sendQuotation = async ()=>{
        setIsSending(true)
        try{
            const quoteData = {
                email: "masiyablessingt@gmail.com",
                quotationData: {
                  customerName: userData.fullname,
                  phoneNumber: userData.phoneNumber,
                  email: "beetaktj1@gmail.com",
                  item: "Product XYZ",
                  price: 99.99
                },
                accessToken,
                tpiQuote
            }
            const response = await EmailApi.post('/send-quotation',quoteData)
            console.log(response)
            if(response.data.message	=== "Quotation sent successfully"){
                setStatusMessage("Quotation Sending Successful")
            }
            else{
                setStatusMessage("Quotation Sending Failed")
                setIsSending(false)
            }
        }
        catch(err){            
            setIsSending(false)
        }
        setIsSending(false)
    }
    const sendNote = async ()=>{
        setIsSending(true)
        try{
            const quoteData = {
                email: "masiyablessingt@gmail.com",
                quotationData: {
                  customerName: userData.fullname,
                  phoneNumber: userData.phoneNumber,
                  email: userData.email,
                  item: "Product XYZ",
                  price: 99.99
                },
                accessToken,
                tpiQuote
              }
            const response = await EmailApi.post('/send-quotation',quoteData)
            console.log(response)
            if(response.data.message === "Quotation sent successfully"){
                setStatusMessage("Quotation Sending Successful")
            }
            else{
                setStatusMessage("Quotation Sending Failed")
                setIsSending(false)
            }
        }
        catch(err){            
            setIsSending(false)
        }
        setIsSending(false)
    }

    const fetchInsurers = useCallback(async () => {
        setLoading(true)
        try {
            const response = await InsuranceApi.get('/insurers')
            if (response.data.httpStatus === "OK") {
                setInsurers(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching insurers:", error)
            setStatusMessage("Failed to fetch insurers")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        setupInterceptors(() => user, setUser);
        fetchInsurers()
    }, [])

    useEffect(() => {
        const fetchQuotes = async () => {
            setLoading(true)
            setQuotations([])


            const results = []
            try {
                // Determine coverType based on propertyValue and value
                let coverType;
                if (propertyData.propertyValue && propertyData.value) {
                    coverType = 'BOTH';
                } else if (!propertyData.propertyValue && propertyData.value) {
                    coverType = 'HOUSE';
                } else if (propertyData.propertyValue && !propertyData.value) {
                    coverType = 'HOUSEHOLD_ITEMS';
                }
                // Remove empty properties
                const { buildingAddress, propertyAddress, propertyValue, ...restPropertyData } = propertyData;
                const modifiedPropertyData = {
                    ...restPropertyData,
                    coverType: coverType || 'undefined', // Default value if none applies
                    ...(propertyAddress && { propertyAddress }), // Include if not empty
                    ...(propertyValue && { propertyValue }) // Include if not empty
                };
                const response = await InsuranceApi.post(`property-details`, modifiedPropertyData)
                console.log(response)
                if (response.status === 200 && response.data.code === "OK") {
                    if (response.data.data) {
                      const quoteResult = response.data.data.insurerPropertyRates;
                      const modifiedResults = quoteResult.map(result => {
                        const insurer = insurers.find(ins => ins.insurerName === result.insurerName);
                        return {
                            ...result,
                            insurerEmail: insurer?.email||"undefined",
                            insurerId: insurer?.insurerId || 1,
                            insurerLogo: insurer ? insurer.insurerLogo : "",
                            insurerName: insurer ? insurer.insurerName : result.insurerName,
                            insurerAddress: insurer ? insurer.address : "undefined",
                            quotationId: `CIC${Math.random().toString(36).substr(2, 9)}`,
                            merchantRef: `ref-${Math.random().toString(36).substr(2, 9)}`
                        };
                      });
                      results.push(...modifiedResults);
                    }
                }
            } catch (error) {
                console.error("Error fetching quote:", error)
                return null
            }
            if(results.length>0)
                setStatusMessage("Quotes loaded successfully.")
            else
                setStatusMessage("Error fetching quotations.")
            setQuotations(results)
            setLoading(false)
            if(results.length>0)
                setStatusMessage("Quotes loaded successfully.")
            else
                setStatusMessage("Error fetching quotations.")
            setQuotations(results)
            setLoading(false)
        }
        fetchQuotes()
    }, [insurers])

    const handlePaymentSuccess = useCallback((quotation, currency) => {
        setProcessingPayment(false)
        // setStatusMessage("Payment successful")
        cashPayment({quotation, currency, method: "ECOCASH"})
    }, [quotations, pollingMerchantRef])
    
    const handlePaymentFailure = useCallback((error) => {
        setProcessingPayment(false)
        setStatusMessage("Payment failed: " + error)
    }, [])

    const mobilePayment = useCallback(
        async (merchantRef, mobile, quotation) => {
          console.log("mobile number: ", mobile)
          setProcessingPayment(true)
          setStatusMessage("Initiating payment...")
          const body = {
            username: "InnovationEcocash",
            password: "InnoEco@15022023#",
          }
          const paymentBody = {
            customerMobileNumber: mobile ? `+263${mobile}` : propertyData.phoneNumber,
            merchantRef,
            amount: quotation.calculatedPrice,
            transactionDescription: "Insurance Payment",
          }
          try {
            const result = await PaymentsApi.post(`/Authenticate/login`, body)
            if (result && result.data.token) {
              setPaymentToken(result.data.token)
              const headers = {
                Authorization: `Bearer ${result.data.token}`,
                "Content-Type": "application/json",
              }
              const mobilePaymentUrl =
                propertyData.currency === "USD" ? "/Mobilemoney/PayUSDEcocash" : "/Mobilemoney/payEcocash"
              const payResult = await PaymentsApi.post(mobilePaymentUrl, paymentBody, { headers })
              console.log("payment currency", propertyData.currency)
              if (payResult.status === 200 && payResult.data.resultDescription === "PENDING SUBSCRIBER VALIDATION") {
                setPollingMerchantRef(payResult.data.merchantReference)
                setStatusMessage("Payment initiated. Waiting for subscriber validation...")
                pollPayment(payResult.data.merchantReference, result.data.token, quotation)
              } else {
                setStatusMessage(`Payment failed for insurance ID: ${quotation.quotationId}`)
                setProcessingPayment(false)
              }
            } else {
              setStatusMessage("Authentication failed")
              setProcessingPayment(false)
            }
          } catch (error) {
            console.error("Payment error:", error)
            setStatusMessage(`Payment failed for insurance ID: ${quotation.quotationId}`)
            setProcessingPayment(false)
          }
        },
        [propertyData.phoneNumber, propertyData.currency],
    )

    const pollPayment = useCallback(
        async (merchantRef, token, quotation) => {
          let attempts = 0
          const maxAttempts = 30 // Poll for 5 minutes (10 seconds * 30)
          const pollInterval = 10000 // 10 seconds
    
          const poll = async () => {
            if (attempts >= maxAttempts) {
              handlePaymentFailure("Payment timed out")
              return
            }
    
            try {
              const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              }
              const result = await PaymentsApi.post(
                `/Mobilemoney/CheckEcocashTransaction`,
                {
                  merchantRef: merchantRef,
                },
                { headers },
              )
    
              if (result && result.data.resultDescription === "Successful") {
                handlePaymentSuccess(quotation, propertyData.currency)
              } else if (result && result.data.resultDescription === "FAILED") {
                handlePaymentFailure("Payment failed")
              } else {
                attempts++
                setStatusMessage(`Checking payment status... Attempt ${attempts}`)
                setTimeout(poll, pollInterval)
              }
            } catch (error) {
              console.error("Polling error:", error)
              handlePaymentFailure("Error while checking payment status")
            }
          }
    
          poll()
        },
        [handlePaymentSuccess, handlePaymentFailure],
    )

    const cashPayment = useCallback(async ({quotation, method}) => {
        setProcessingPayment(true);
        const transactionDescription = {
            user: {
                fullName: userData.fullName,
                idNumber: userData.idNumber,
                phone: userData.phoneNumber,
                email: userData.email
            },
            coverDetails:  {
                coverType: propertyData.coverType,
                premium: quotation.calculatedPrice,
                currency: propertyData.currency,
                rate: quotation.rate,
            }
        };

        if (propertyData.value) {
            transactionDescription.houseDetails = {
                address: propertyData.buildingAddress||"undefined",
                value: propertyData.value,
                buildingType: propertyData.buildingType,
                constructionType: propertyData.constructionType,
                roofType: propertyData.roofType,
                houseDescription: propertyData.houseDescription,
            };
        }

        if (propertyData.propertyValue) {
            transactionDescription.houseDetails = {
                address: propertyData.propertyAddress||"undefined",
                value: propertyData.propertValue||"undefined",
                description: propertyData.description||"undefined",
            };
        }

        const paymentBody = {
            insuranceCategory: "PROPERTY",
            salesAgentId: user.userId,
            insurerId: quotation.insurerId,
            iceCashId: quotation.iceCashId,
            productDescription: `l`,
            transactionDescription: JSON.stringify(transactionDescription),
            referenceNumber: quotation.merchantRef,
            mobileNumber: userData.phoneNumber,
            paymentStatus: "ACCEPTED",
            paymentMethod: method,
            amount: quotation.calculatedPrice,
            currency: propertyData.currency
        }
        try {
            const payResult = await InsuranceApi.post("/product-payments", paymentBody)
            console.log("payment: ", payResult)
            if(payResult.data.code==="CREATED" && payResult.data.message==="Product payment created"){
                setQuotations(prevData => prevData.filter(policy => policy.quotationId === quotation.quotationId))
                setPaymentStatus(true)
                setStatusMessage(`Payment successful for insurance ID: ${quotation.quotationId}`)
            }
        } catch (error) {
            setStatusMessage(`Payment failed for insurance ID: ${quotation.quotationId}`)
        } finally {
            setProcessingPayment(false);
        }
    }, [user.userId])

    const handlePaymentOption = useCallback((option, quotationId) => {
        setPaymentStates(prevStates => {
        const newStates = {};
        Object.keys(prevStates).forEach(key => {
            if (key !== quotationId) {
                newStates[key] = { method: '', showMobileInput: false, mobile: '' };
            }
        });
        newStates[quotationId] = {
            method: option,
            showMobileInput: option === 'mobile',
            mobile: prevStates[quotationId]?.mobile || ''
        };
        return newStates;
        });
    }, []);

    const handleMobileChange = useCallback((quotationId, value) => {
        setPaymentStates(prevStates => ({
            ...prevStates,
            [quotationId]: {
                ...prevStates[quotationId],
                mobile: value
            }
        }));
    }, []);

    const QuotationItem = useCallback(({ quotation, index }) => {
        const [localMobile, setLocalMobile] = useState('');
        const quotationId = quotation.quotationId;
        const paymentState = paymentStates[quotationId] || {};
        const { method: paymentMethod, showMobileInput } = paymentState

        const handleLocalMobileChange = useCallback((e) => {
            setLocalMobile(e.target.value);
        }, []);

        return (
            <div key={quotation.quotationId || `quotation-${index}`} className="flex flex-col mb-4">
                <div className="flex space-x-2 p-2">
                    <div className={`flex-1 rounded-full shadow-lg border border-gray-300 overflow-hidden transition-all duration-300 ease-in-out ${showMobileInput ? '-ml-40' : ''}`}>
                        <div className="bg-gray-200 bg-gradient-to-b from-[#171b1b] to-[#4d97eb] opacity-70 backdrop-blur-3xl p-2">
                            <div className="flex text-xs text-white font-semibold text-center" style={{ lineHeight: '0.6' }}>
                                <div className="flex-1">{quotation.insurerName}</div>
                                <div className="flex-1">Policy</div>
                                <div className="flex-1">Policy Type</div>
                                <div className="flex-1">Premium %</div>
                                <div className="flex-1">Premium</div>
                            </div>
                        </div>
                        <div className="flex text-sm bg-gray-50 pt-1 text-gray-600 text-center" style={{ lineHeight: '0.6' }}>
                            <div className='flex-1 flex justify-center items-center'>
                                <img
                                    className="h-4 rounded-full"
                                    src={quotation.insurerLogo || '/images/questionmark.png'}
                                    alt={`${quotation.insurerName} logo`}
                                />
                            </div>
                            {
                                <>
                                    <div className="flex-1">{quotation.policy}</div>
                                    <div className="flex-1">{quotation.policyType}</div>
                                    <div className="flex-1">{quotation.rate}</div>
                                    <div className="flex-1">{quotation.calculatedPrice}</div>
                                </>
                            }
                        </div>
                    </div>
                    {showMobileInput && (
                        <div className="flex items-center w-40">
                            <div className="flex items-center border rounded-full overflow-hidden">
                                <span className="bg-gray-200 text-gray-900 px-2 py-1.5 font-medium">+263</span>
                                <input
                                    type="text"
                                    id={`mobile-${quotation.quotationId}`}
                                    autoComplete="off"
                                    placeholder='Mobile'
                                    name="mobile"
                                    value={localMobile}
                                    onChange={handleLocalMobileChange}
                                    className="block w-full border-0 rounded-r-full py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-200 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex w-68 space-x-2 items-center relative">
                        <div className='relative'>
                            <button
                                className='py-1 px-3 rounded-full border border-gray-300 bg-gray-600 text-white w-36'
                                onClick={() => handlePaymentOption(paymentMethod ? '' : 'select', quotationId)}
                                aria-haspopup="true"
                                aria-expanded={!!paymentMethod}
                            >
                                {!paymentMethod && "Make Payment"}
                                {paymentMethod === "select" && "Select Payment"}
                                {paymentMethod === "cash" && "Cash Payment"}
                                {paymentMethod === "mobile" && "Mobile Payment"}
                                {paymentMethod === "swipe" && "Swipe Payment"}
                            </button>
                            {paymentMethod === 'select' && (
                                <div
                                    className="absolute left-0 mt-1 w-36 z-10 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden text-sm text-center"
                                >
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                        onClick={() => handlePaymentOption('cash', quotationId)}
                                    >
                                        Cash Payment
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                        onClick={() => handlePaymentOption('mobile', quotationId, quotation.currency)}
                                    >
                                        Mobile Payment
                                    </button>
                                    {/* <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                        onClick={() => handlePaymentOption('swipe', quotation.InsuranceID)}
                                    >
                                        Swipe Payment
                                    </button> */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {paymentMethod && paymentMethod !== 'select' && (
                    <button
                        className="mt-2 py-1 px-3 rounded-full border border-gray-300 bg-green-500 text-white w-full disabled:opacity-50"
                        onClick={() => {
                            if (paymentMethod === 'cash') {
                                cashPayment({quotation, currency: propertyData.currency, method: "CASH"});
                            } else if (paymentMethod === 'mobile') {
                                mobilePayment(quotation.merchantRef, localMobile, quotation, propertyData.currency);
                            } else if (paymentMethod === 'swipe') {
                                mobilePayment(quotation.merchantRef, localMobile, quotation.quotationId, propertyData.currency);
                            }
                        }}
                        disabled={processingPayment||paymentStatus}
                    >
                        {processingPayment ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            paymentStatus? "Paid" : `Confirm ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} Payment`
                        )}
                    </button>
                )}
            </div>
        )
    }, [paymentStates, handlePaymentOption, handleMobileChange, mobilePayment, cashPayment, processingPayment, paymentStatus]) // Update 5

    return (
        <div className='flex flex-col flex-1 h-screen justify-center bg-gray-200 bg-opacity-50 items-center fixed inset-0 z-50'
        >
            <div className='flex flex-col w-5/6 max-h-[90vh] justify-center bg-white p-4 rounded-lg border border-gray-200' onClick={(e) => e.stopPropagation()}>
                <div className='w-full flex justify-end'>
                    <button
                        onClick={() => setModal(false)}
                        className='bg-gray-500 w-8 h-8 rounded-full flex justify-center items-center'
                        aria-label="Close modal"
                    >
                        <i className='fas fa-times text-white' />
                    </button>
                </div>
                {loading && quotations.length < 1 && (
                    <div className="flex flex-col w-full justify-center">
                        <BarLoader
                            color='#3B82F6'
                            loading={loading}
                            cssOverride={{
                                display: "block",
                                margin: "0 auto",
                                borderColor: "blue",
                            }}
                            aria-label="Loading Spinner"
                        />
                        <p className='text-center text-[#3B82F6]'>Loading</p>
                    </div>
                )}
                {!loading && propertyData && quotations.length > 0 && (
                    <div className="flex justify-between space-x-2 mt-2">
                        <div className="flex flex-col">
                            <div className="flex flex-col border rounded-md p-2 w-[180px] min-h-56 bg-gray-200 bg-gradient-to-r from-[#000] to-[#0453ae] opacity-70 text-white">
                                <h2 className="text-lg font-semibold mb-2">Property Details</h2>
                                <p className='text-sm flex uppercase'><span className='w-16 font-semibold'>House Address:</span>{propertyData.buildingAddress||""}</p>
                                <p className='text-sm flex uppercase'><span className='w-16 font-semibold'>House Value:</span>{propertyData.value}</p>
                                {/* <p className='text-sm flex'><span className='w-16 font-semibold'>Age:</span>{propertyData.property[0].age}</p>
                                <p className='text-sm flex'><span className='w-16 font-semibold'>Res:</span>{propertyData.residence}</p>
                                <p className='text-sm flex'><span className='w-16 font-semibold'>Dest:</span>{propertyData.destination}</p> */}
                            </div>
                            <AnimatePresence mode="wait">
                                {quotations && !paymentStatus && (
                                    <motion.div
                                        key="send-quote"
                                        variants={buttonVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <button 
                                            className='py-1 px-3 rounded-full w-full border border-gray-300 bg-blue-400 text-white mt-4 hover:bg-blue-500 transition-colors duration-200'
                                            onClick={sendQuotation}
                                            disabled={isSending}
                                        >
                                            {isSending ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </span>
                                                ) : (
                                                <>
                                                    <i className='fa fa-envelope mr-2'/>
                                                    Send Quote
                                                </>
                                            )}
                                        </button>
                                        <QuotationPrinter data={quotations}/>
                                    </motion.div>
                                )}
                                {paymentStatus && (
                                    <motion.div
                                        key="payment-status"
                                        variants={buttonVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="space-y-2"
                                    >
                                        <motion.div variants={buttonVariants}>
                                            <button 
                                                className='py-1 px-3 rounded-full w-full border border-gray-300 bg-green-400 text-white mt-4 hover:bg-green-500 transition-colors duration-200'
                                                onClick={sendNote}
                                            >
                                            <i className='fa fa-paper-plane mr-2'/>
                                                Send Cover Note
                                            </button>
                                        </motion.div>
                                        <CoverNotePrinter data={quotations}/>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                        </div>
                        <div className="flex flex-col border rounded-md border-gray-300 flex-1 p-2 overflow-auto">
                            {quotations.map((quotation, index) => (
                                <QuotationItem 
                                    key={quotation.quotationId || `quotation-${index}`} 
                                    quotation={quotation} 
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!loading && (!propertyData || quotations.length === 0) && (
                    <div className="flex w-full flex-col border border-gray-300 rounded-2xl justify-center items-center py-3 mt-2">
                        <i className='fa fa-triangle-exclamation text-[54px]' />
                        Oops, something went wrong
                    </div>
                )}
                {statusMessage && (
                    <div className="mt-4 p-2 bg-blue-100 text-blue-800 rounded-md">
                        {statusMessage}
                    </div>
                )}
            </div>
        </div>
    )
}

const buttonVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  }