import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { BarLoader } from 'react-spinners'
import IceCashApi from '../../api/IceCashApi'
import { StepperContext } from '../../../context/StepperContext'
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi'
import insuranceTypes from '../../insuranceTypes.json'
import useAuth from '../../../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import CoverNotePrinter from './CoverNotePrinter'
import QuotationPrinter from './QuotationPrinter'
import EmailApi from '../../api/EmailApi'
import PaymentsApi from '../../api/PaymentsApi'
// import PaymentPolling from './PaymentPolling'

export default function QuotationModal({ setModal }) {
    const [loading, setLoading] = useState(false)
    const [statusMessage, setStatusMessage] = useState("")
    const [insurers, setInsurers] = useState([])
    const [quotations, setQuotations] = useState([])
    const [paymentStatus, setPaymentStatus] = useState(false)
    const [paymentStates, setPaymentStates] = useState({})
    const [paymentToken, setPaymentToken] = useState({})
    const [processingPayment, setProcessingPayment] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [pollingMerchantRef, setPollingMerchantRef] = useState(null)

    const { vehicleData, policyData, setPolicyData, userData, subscriptionMethod } = useContext(StepperContext)
    const { user, setUser } = useAuth()
    const { accessToken, userId } = user

    const sendQuotation = async () => {
        setIsSending(true)
        let Quote
        switch (subscriptionMethod) {
            case 'TPIQuote':
                Quote = TPIQuote
                break
            case 'TPILICQuote':
                Quote = TPILICQuote
                break
            case 'LICQuote':
                Quote = LICQuote
                break
            default:
                console.error('Invalid subscription method')
        }
        try {
            const quoteData = {
                email: userData.email,
                quotationData: {
                    customerName: userData.fullname,
                    phoneNumber: userData.phoneNumber,
                    email: userData.email,
                    item: "Product XYZ"
                },
                accessToken,
                Quote
            }
            const response = await EmailApi.post('/send-quotation', quoteData)
            console.log(response)
            if (response.data.message === "Quotation sent successfully") {
                setStatusMessage("Quotation Sending Successful")
            }
            else {
                setStatusMessage("Quotation Sending Failed")
                setIsSending(false)
            }
        }
        catch (err) {
            setIsSending(false)
        }
        setIsSending(false)
    }

    const sendNote = async () => {
        setIsSending(true)
        try {
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
            if (response.data.message === "Quotation sent successfully") {
                setStatusMessage("Quotation Sending Successful")
            }
            else {
                setStatusMessage("Quotation Sending Failed")
                setIsSending(false)
            }
        }
        catch (err) {
            setIsSending(false)
        }
        setIsSending(false)
    }

    const TPILICQuote = useMemo(() => ({
        Version: "2.0",
        Request: {
            Function: "TPILICQuote",
            Vehicles: [
                {
                    VRN: vehicleData.VRN,
                    EntityType: "Personal",
                    ClientIDType: "1",
                    IDNumber: "ABCDEFGHIJ1",
                    CompanyName: "",
                    FirstName: "John",
                    LastName: "Smith",
                    MSISDN: "0771234123",
                    Email: "email@ice.cash",
                    BirthDate: "19800202",
                    Address1: "Address line 1",
                    Address2: "Address line 2",
                    SuburbID: "2",
                    Policy_IDNumber: "ABCDEFGHIJ2",
                    Policy_CompanyName: "",
                    Policy_FirstName: "Jane",
                    Policy_LastName: "Smith",
                    Policy_MSISDN: "0771234123",
                    Policy_Email: "email@ice.cash",
                    Policy_Address1: "Address line 1",
                    Policy_Address2: "Address line 2",
                    Policy_EntityType: "Personal",
                    Policy_BirthDate: "19700101",
                    InsuranceType: policyData.insuranceType,
                    VehicleType: vehicleData.vehicleTypeId,
                    VehicleValue: "1000",
                    DurationMonths: policyData.insuranceTerm,
                    LicFrequency: policyData.LicFrequency,
                    RadioTVUsage: policyData.RadioTVUsage,
                    RadioTVFrequency: policyData.RadioTVFrequency,
                    CustomerReference: "Ref 1",
                    Currency: policyData.currency
                }
            ]
        }
    }), [vehicleData, policyData])

    const TPIQuote = useMemo(() => ({
        Version: "2.1",
        Request: {
            Function: "TPIQuote",
            Vehicles: [{
                VRN: vehicleData.VRN,
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
                DurationMonths: policyData.insuranceTerm,
                InsuranceType: policyData.insuranceType,
                VehicleType: vehicleData.vehicleTypeId,
                VehicleValue: "1000",
                CustomerReference: "Ref 1",
                Currency: policyData.currency
            }]
        }
    }), [vehicleData, policyData])

    const LICQuote = useMemo(() => ({
        Version: "2.1",
        Request: {
            Function: "LICQuote",
            Vehicles: [
                {
                    VRN: vehicleData.VRN,
                    IDNumber: "ABCDEFGHIJ1",
                    ClientIDType: "1",
                    FirstName: "",
                    LastName: "",
                    Address1: "Address line 1",
                    Address2: "Address line 2",
                    SuburbID: "2",
                    LicFrequency: "1",
                    DurationMonths: policyData.insuranceTerm,
                    RadioTVUsage: policyData.RadioTVUsage,
                    RadioTVFrequency: policyData.RadioTVFrequency,
                    Currency: policyData.currency
                }
            ]
        }
    }), [vehicleData, policyData])

    const fetchInsurers = useCallback(async () => {
        setLoading(true)
        try {
            const response = await InsuranceApi.get('/insurers')
            if (response.data.httpStatus === "OK") {
                const filteredInsurers = response.data.data.filter((insurer) => insurer.iceCashId !== 0)
                setInsurers(filteredInsurers)
            }
        } catch (error) {
            console.error("Error fetching insurers:", error)
            setStatusMessage("Failed to fetch insurers")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchInsurers()
        setupInterceptors(() => user, setUser);
    }, [fetchInsurers])

    const quote = useCallback(async (insurerId, TPIQuote) => {
        const url = subscriptionMethod === 'TPIQuote' ? '/request/20500338/tpi/quotes' : subscriptionMethod === 'TPILICQuote' ? '/request/20500338/tpilic/quotes' : subscriptionMethod === 'LICQuote' ? '/request/20500338/license/quotes' : ""
        try {
            const response = await IceCashApi.post(url, TPIQuote)
            console.log(response)
            if (response.statusText === "OK" && response.data.Response.Result > 0) {
                return { quoteResult: response.data.Response.Quotes, merchantRef: response.data.PartnerReference }
            } else if (
                response.statusText === "OK" && (
                    response.data.Response.Quotes[0].Message === "USD payments are currently suspended for this company" ||
                    response.data.Response.Quotes[0].Message === "ZWG payments are currently suspended for this company"
                )
            ) {
                setStatusMessage("No USD payments")
                return null
            } else {
                throw new Error("Unexpected response")
            }
        } catch (error) {
            console.error("Error fetching quote:", error)
            return null
        }
    }, [])

    const fetchQuotes = async () => {
        if (insurers.length > 0) {
            setLoading(true)
            setQuotations([])
            const results = []

            for (const insurer of insurers) {
                let quoteTemplate

                switch (subscriptionMethod) {
                    case 'TPIQuote':
                        quoteTemplate = TPIQuote
                        break
                    case 'TPILICQuote':
                        quoteTemplate = TPILICQuote
                        break
                    case 'LICQuote':
                        quoteTemplate = LICQuote
                        break
                    default:
                        console.error('Invalid subscription method')
                        continue
                }

                const modifiedQuote = {
                    ...quoteTemplate,
                    Request: {
                        ...quoteTemplate.Request,
                        Vehicles: [
                            {
                                ...quoteTemplate.Request.Vehicles[0],
                                InsuranceCompanyID: insurer.icecashId
                            }
                        ]
                    }
                }

                try {
                    console.log("quote: ", modifiedQuote)
                    const response = await quote(insurer.icecashId, modifiedQuote)
                    console.log("respose: ",response)
                    if (response) {
                        const { quoteResult = [], merchantRef } = response
                        const modifiedResults = quoteResult.map(result => ({
                            ...result,
                            insurerLogo: insurer.insurerLogo,
                            insurerName: insurer.insurerName,
                            insurerAddress: insurer.address||"undefined",
                            insurerEmail: insurer.email||"undefined",
                            insurerId: insurer.insurerId || 1,
                            iceCashId: insurer.icecashId || null,
                            merchantRef,
                            quotationId: result.InsuranceID || `quotation-${Math.random().toString(36).substr(2, 9)}`
                        }))
                        results.push(...modifiedResults)
                    }
                } catch (error) {
                    console.error(`Error fetching quote for ${insurer.insurerName}:`, error)
                }
            }
            if(results.length>0)
                setStatusMessage("Quotes loaded successfully.")
            else
                setStatusMessage("Error fetching quotations.")

            setQuotations(results)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuotes()
    }, [insurers, quote, TPIQuote])

    const generateQuotes = useCallback((quoteData) => {
        const baseQuote = {
            Status: "1"
        }

        let specificQuote = {}

        switch (subscriptionMethod) {
            case 'LICQuote':
                specificQuote = {
                    LicenceID: quoteData.LicenceID,
                    DeliveryMethod: "2",
                    MachineName: "myLocal",
                    LicenceCert: "1"
                }
                break
            case 'TPIQuote':
                specificQuote = { InsuranceID: quoteData.InsuranceID }
                break
            case 'TPILICQuote':
                specificQuote = {
                    CombinedID: quoteData.CombinedID,
                    DeliveryMethod: "2",
                    MachineName: "myLocal",
                    LicenceCert: "1"
                }
                break
            default:
                console.warn(`Unexpected subscriptionMethod: ${subscriptionMethod}`)
        }

        return [{ ...baseQuote, ...specificQuote }]
    }, [subscriptionMethod])

    const policyApproval = useCallback(async (quoteData) => {
        const url = subscriptionMethod === 'TPIQuote'
            ? '/request/20500338/tpiquote/update'
            : subscriptionMethod === 'TPILICQuote'
                ? '/request/20500338/tpilic-quote/update'
                : subscriptionMethod === 'LICQuote'
                    ? '/request/20500338/licquote/update'
                    : ""

        const func = subscriptionMethod === 'TPIQuote'
            ? 'TPIQuoteUpdate'
            : subscriptionMethod === 'TPILICQuote'
                ? 'TPILICUpdate'
                : subscriptionMethod === 'LICQuote'
                    ? 'LicQuoteUpdate'
                    : ""

        const data = {
            Version: "2.0",
            Request: {
                Function: func,
                PaymentMethod: "1",
                Identifier: "",
                MSISDN: "263777224008",
                Quotes: generateQuotes(quoteData)
            }
        }

        try {
            const response = await IceCashApi.post(url, data)
            console.log("quotations: ", quotations)
            console.log("selected quote: ", quoteData)

            console.log("payment result: ", response)
            if (response.Status && response.Result === 1) {
                setStatusMessage("Policy Approval Successful")
                setPaymentStatus(true)
                setQuotations(prevData => prevData.filter(policy => policy.quotationId === quoteData.quotationId))
                return { message: "success" }
            } else if (response.Result !== 1) {
                setStatusMessage("Policy Approval Failed")
                setPaymentStatus(true)
                console.log(response)
                setQuotations(prevData => prevData.filter(policy => policy.quotationId === quoteData.quotationId))
                return { message: "failed" }
            } else {
                setStatusMessage("Policy Approval Failed")
                throw new Error("Unexpected response")
            }
        } catch (error) {
            setStatusMessage("Policy Approval Failed")
            console.error("Error fetching quote:", error)
            return { message: "failed" }
        }
    }, [subscriptionMethod, generateQuotes])

    const handlePaymentSuccess = useCallback((quotation, currency) => {
        setProcessingPayment(false)
        setStatusMessage("Payment successful")
        // policyApproval(quotations.find((q) => q.merchantRef === pollingMerchantRef))
        cashPayment({quotation, currency, method: "ECOCASH"})
    }, [policyApproval, quotations, pollingMerchantRef])
    
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
            customerMobileNumber: mobile ? `+263${mobile}` : userData.phoneNumber,
            merchantRef,
            amount: 0.01,
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
                policyData.currency === "USD" ? "/Mobilemoney/PayUSDEcocash" : "/Mobilemoney/payEcocash"
              const payResult = await PaymentsApi.post(mobilePaymentUrl, paymentBody, { headers })
              console.log("payment currency", policyData.currency)
              if (payResult.status === 200 && payResult.data.resultDescription === "PENDING SUBSCRIBER VALIDATION") {
                setPollingMerchantRef(payResult.data.merchantReference)
                setStatusMessage("Payment initiated. Waiting for subscriber validation...")
                pollPayment(payResult.data.merchantReference, result.data.token, quotation)
              } else {
                setStatusMessage(`Payment failed for insurance ID: ${quotation.InsuranceID}`)
                setProcessingPayment(false)
              }
            } else {
              setStatusMessage("Authentication failed")
              setProcessingPayment(false)
            }
          } catch (error) {
            console.error("Payment error:", error)
            setStatusMessage(`Payment failed for insurance ID: ${quotation.InsuranceID}`)
            setProcessingPayment(false)
          }
        },
        [userData.phoneNumber, policyData.currency],
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
                handlePaymentSuccess(quotation, policyData.currency)
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

    const cashPayment = useCallback(async ({quotation, currency, method}) => {
        setProcessingPayment(true);
        const transactionDescription = {
            user: {
                username: userData.fullname,
                idNumber: userData.idNumber,
                phone: userData.phoneNumber,
                email: userData.email
            },
            vehicle: {
                VRN: vehicleData.VRN,
                make: vehicleData.make,
                model: vehicleData.model,
                year: vehicleData.YearManufacture
            },
            policy: {
                insuranceType: getInsuranceType(quotation.Policy.InsuranceType),
                coverAmount: quotation.Policy.CoverAmount,
                premiumAmount: quotation.Policy.PremiumAmount,
                stampDuty: quotation.Policy.StampDuty,
                amount: quotation.Policy.Amount,
                durationMonths: quotation.Policy.DurationMonths,
                governmentLevy: quotation.Policy.GovernmentLevy,
                insuranceCompany: quotation.insurerName,
                startDate: quotation.Policy.StartDate,
                endDate: quotation.Policy.EndDate
            }
        };
        
        if (quotation.Licence) {
            transactionDescription.zbc = {
                policyAmount: quotation.Policy.Amount,
                arrears: quotation.Licence.ArrearsAmt,
                penalties: quotation.Licence.PenaltiesAmt,
                radio: quotation.Licence.RadioTVAmt,
                total: quotation.Licence.TotalAmount,
                startDate: quotation.Licence.StartDate,
                endDate: quotation.Licence.EndDate
            };
        }
        
        if (quotation.Licence) {
            transactionDescription.zinara = {
                arrears: quotation.Zinara.ArrearsAmt,
                penalties: quotation.Zinara.PenaltiesAmt,
                radio: quotation.Zinara.RadioTVAmt,
                total: quotation.Zinara.TotalAmount,
                startDate: quotation.Zinara.StartDate,
                endDate: quotation.Zinara.EndDate
            };
        }

        const paymentBody = {
            insuranceCategory: "MOTOR_VEHICLE",
            salesAgentId: user.userId,
            insurerId: quotation.insurerId,
            iceCashId: quotation.iceCashId,
            productDescription: `${getInsuranceType(quotation.Policy.InsuranceType)}`,
            transactionDescription: JSON.stringify(transactionDescription),
            referenceNumber: quotation.merchantRef,
            mobileNumber: userData.phoneNumber,
            paymentStatus: "PENDING",
            paymentMethod: method,
            amount: quotation.amount,
            currency: policyData.currency
        }
        try {
            const payResult = await InsuranceApi.post("/product-payments", paymentBody)
            setStatusMessage(`Payment successful for insurance ID: ${quotation.InsuranceID}`)
            console.log("payment: ", payResult)
            if(payResult.data.code==="CREATED" && payResult.data.message==="Product payment created"){
                const policyResult = await policyApproval(quotation)
                console.log("policy approval status", policyResult)
            }
        } catch (error) {
            setStatusMessage(`Payment failed for insurance ID: ${quotation.InsuranceID}`)
        } finally {
            setProcessingPayment(false);
        }
    }, [userId, vehicleData.VRN])

    const handlePaymentOption = useCallback((option, quotationId, currency) => {
        setPaymentStates(prevStates => {
            const newStates = { ...prevStates };
            Object.keys(newStates).forEach(key => {
                if (key !== quotationId) {
                    newStates[key] = { method: '', showMobileInput: false, mobile: '', currency: '' };
                }
            });
            newStates[quotationId] = {
                method: option === prevStates[quotationId]?.method ? '' : option,
                showMobileInput: option === 'mobile',
                mobile: prevStates[quotationId]?.mobile || '',
                currency: currency
            };
            return newStates;
        });
    }, []);

    const getInsuranceType = useCallback((type) => {
        const typeInt = parseInt(type, 10)
        const insurance = insuranceTypes.find(item => item.InsuranceType === typeInt)
        return insurance ? insurance.Code : "Not found"
    }, [])

    const QuotationItem = useCallback(({ quotation, index }) => {
        const [localMobile, setLocalMobile] = useState('');
        const quotationId = quotation.quotationId;
        const paymentState = paymentStates[quotationId] || {};
        const { method: paymentMethod, showMobileInput } = paymentState

        const handleLocalMobileChange = useCallback((e) => {
            setLocalMobile(e.target.value);
        }, []);

        return (
            <div key={quotation.quotationId} className="flex flex-col mb-4">
                <div className="flex space-x-2 p-2">
                    <div className={`flex-1 rounded-full shadow-lg border border-gray-300 overflow-hidden transition-all duration-300 ease-in-out ${showMobileInput ? '-ml-40' : ''}`}>
                        <div className="bg-gray-200 bg-gradient-to-b from-[#171b1b] to-[#4d97eb] opacity-70 backdrop-blur-3xl p-2">
                            <div className="flex text-xs text-white font-semibold text-center" style={{ lineHeight: '0.6' }}>
                                <div className="flex-1">{quotation.insurerName}</div>
                                {
                                    !quotation.Policy && !quotation.Licence && <>
                                        <div className="flex-1">Radio</div>
                                        <div className="flex-1">Arrears</div>
                                        <div className="flex-1">Penalties</div>
                                        <div className="flex-1">Total</div>
                                    </>
                                }
                                {
                                    quotation.Policy && !quotation.Licence && <>
                                        <div className="flex-1">Cover</div>
                                        <div className="flex-1">Govt Levy</div>
                                        <div className="flex-1">Stamp Duty</div>
                                    </>
                                }
                                {
                                    quotation.Policy && <>
                                        <div className="flex-1">Insurance Type</div>
                                        <div className="flex-1">Ins Premium</div>
                                    </>
                                }
                                {quotation.Licence && <>
                                    <div className="flex-1">Lic Arrears</div>
                                    <div className="flex-1">$Penalties</div>
                                    <div className="flex-1">Radio</div>
                                    <div className="flex-1">Lic Total</div>
                                </>}
                                <div className="flex-1">Total Payable</div>
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
                                !quotation.Policy && !quotation.Licence && <>
                                    <div className="flex-1">{quotation.TotalRadioTVAmt}</div>
                                    <div className="flex-1">{quotation.ArrearsAmt}</div>
                                    <div className="flex-1">{quotation.PenaltiesAmt}</div>
                                    <div className="flex-1">{quotation.TotalAmount}</div>
                                </>
                            }
                            {
                                quotation.Policy && !quotation.Licence && <>
                                    <div className="flex-1">${quotation.Policy.CoverAmount}</div>
                                    <div className="flex-1">${quotation.Policy.GovernmentLevy}</div>
                                    <div className="flex-1">${quotation.Policy.StampDuty}</div>
                                </>
                            }
                            {
                                quotation.Policy && <>
                                    <div className="flex-1">{getInsuranceType(quotation.Policy.InsuranceType)}</div>
                                    <div className="flex-1">${quotation.Policy.PremiumAmount}</div>
                                </>
                            }
                            {quotation.Licence && <>
                                <div className="flex-1">${quotation.Licence.ArrearsAmt}</div>
                                <div className="flex-1">${quotation.Licence.PenaltiesAmt}</div>
                                <div className="flex-1">${quotation.Licence.RadioTVAmt}</div>
                                <div className="flex-1">${quotation.Licence.TotalAmount}</div>
                            </>}
                            {(() => {
                                const licenceTotal = quotation.Licence ? parseFloat(quotation.Licence.TotalAmount) || 0 : 0;
                                const policyTotal = quotation.Policy ? parseFloat(quotation.Policy.Amount) || 0 : 0;
                                const totalAmount = parseFloat(quotation.TotalAmount) || 0;

                                let finalTotal = 0;
                                if (quotation.Licence && quotation.Policy) {
                                    finalTotal = licenceTotal + policyTotal;
                                } else if (quotation.Licence) {
                                    finalTotal = licenceTotal;
                                } else if (quotation.Policy) {
                                    finalTotal = policyTotal;
                                } else {
                                    finalTotal = totalAmount;
                                }

                                return (
                                    <div className="flex-1 font-semibold text-gray-800">
                                        ${isNaN(finalTotal) ? '0.00' : finalTotal.toFixed(2)}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                    {showMobileInput && (
                        <div className="flex items-center w-40">
                            <div className="flex items-center border rounded-full overflow-hidden">
                                <span className="bg-gray-200 text-gray-900 px-2 py-1.5 font-medium">+263</span>
                                <input
                                    type="text"
                                    id={`mobile-${quotation.InsuranceID}`}
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
                                        onClick={() => handlePaymentOption('mobile', quotation.InsuranceID, quotation.currency)}
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
                                cashPayment({quotation, currency: policyData.currency, method: "CASH"});
                            } else if (paymentMethod === 'mobile') {
                                mobilePayment(quotation.merchantRef, localMobile, quotation, policyData.currency);
                            } else if (paymentMethod === 'swipe') {
                                mobilePayment(quotation.merchantRef, localMobile, quotation.InsuranceID, policyData.currency);
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
    }, [paymentStates, handlePaymentOption, mobilePayment, cashPayment, getInsuranceType, processingPayment, paymentStatus])

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
                {!loading && vehicleData && quotations.length > 0 && (
                    <div className="flex justify-between space-x-2 mt-2">
                        <div className="flex flex-col">
                            <div className="flex flex-col border rounded-md p-2 w-[180px] min-h-56 bg-gray-200 bg-gradient-to-r from-[#000] to-[#0453ae] opacity-70 text-white">
                                <h2 className="text-lg font-semibold mb-2">Vehicle Details</h2>
                                <p className='text-sm flex uppercase'><span className='w-16 font-semibold'>VRN:</span>{vehicleData.VRN}</p>
                                <p className='text-sm flex'><span className='w-16 font-semibold'>Make:</span>{vehicleData.make}</p>
                                <p className='text-sm flex'><span className='w-16 font-semibold'>Model:</span>{vehicleData.model}</p>
                                <p className='text-sm flex'><span className='w-16 font-semibold'>Year:</span>{vehicleData.YearManufacture}</p>
                                <p className='text-sm flex'><span className='w-16 font-semibold'>Policy:</span>{vehicleData.vehicleType}</p>
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
                                    key={quotation.quotationId}
                                    quotation={quotation} 
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!loading && (!vehicleData || quotations.length === 0) && (
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

