import React, { useEffect, useState } from 'react'
import { HashLoader } from 'react-spinners';
import Modal from '../../modal/Modal';
import useAuth from '../../../hooks/useAuth';
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi';


export default function TravelInsuranceModal({ data, refresh, setModal }) {

    const { user, setUser } = useAuth()
    const [insurers, setInsurers] = useState("")

    const [planName, setPlanName] = useState("");
    const [periodRange, setPeriodRange] = useState("");
    const [amount, setAmount] = useState("");
    const [continent, setContinent] = useState(0);
    const [currency, setCurrency] = useState(0);
    const [active, setActive] = useState(true);
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [insurerId, setInsurerId] = useState(0)    

    const isOpen = false
    const close = false

    useEffect(()=>{
        fetchInsurer()
        setupInterceptors(() => user, setUser);
        setPlanName(data.planName)
        setPeriodRange(data.periodRange)
        setAmount(data.amount)
        setContinent(data.continent)
        setCurrency(data.currency)
        setActive(data.active)
        setInsurerId(data.insurerId)

    },[])

    const fetchInsurer = async () => {
        try{
            const response = await InsuranceApi.get(`/insurers`)
            if(response){
                setInsurers(response.data.data)
            }
        }
        catch(err){
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()        
        setLoading(true)
        try{
            const response = await InsuranceApi.put(`/travel-special-plan/${data.id}`,{
                insurerId,
                planName,
                periodRange,
                amount,
                currency,
                continent,
                active
            })
            console.log(response)
            if(response.data&&response.data.code==="OK"){
                setSuccess(true)
            }
            else{
                setFailed(true)
            }
        }
        finally{
            setTimeout(()=>{
                setLoading(false)
                setFailed(false)
                setSuccess(false)
                refresh()
                setModal(close)
            },1000)
        }
    }

    const getModal =(isOpen)=>{
        setModal(isOpen)
    }

    return (
        <Modal setModal={getModal}>
            <h2 className="text-lg font-semibold">Insurance Modification Form</h2>
            <p className="text-xs mb-4">For travel insurance editing</p>
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
                        Policy Name
                    </label>
                    <div className="mt-2 flex-1">
                        <select
                            name="planName"
                            id="planName"
                            placeholder={data.planName}
                            className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            onChange={(e)=>setPlanName(e.target.value)}
                        >
                            <option value="">Plan Name</option>
                            <option value="NORMAL">Normal</option>
                            <option value="STUDENT">Student</option>
                            <option value="CORPORATE">Corporate</option>
                        </select>
                    </div>
                </div>
                <div className="sm:col-span-3 flex items-center">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Max Days Limit
                    </label>
                    <div className="mt-2 flex-1">
                        <input
                            type="text"
                            name="periodRange"
                            id="periodRange"
                            autoComplete="family-name"
                            placeholder={data.periodRange}
                            onChange={(e)=>setPeriodRange(e.target.value)}
                            className="block w-full rounded-xs bg-transparent border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div className="sm:col-span-3 flex items-center">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Amount
                    </label>
                    <div className="mt-2 flex-1">
                        <input
                            type="text"
                            name="amount"
                            id="amount"
                            autoComplete="family-name"
                            placeholder={data.amount}
                            onChange={(e)=>setAmount(e.target.value)}
                            className="block w-full rounded-xs bg-transparent border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div className="sm:col-span-3 flex items-center">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Continent
                    </label>
                    <div className="mt-2 flex-1">
                        <select
                            id="continent"
                            name="continent"
                            placeholder={data.continent}
                            className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            onChange={(e)=>setContinent(e.target.value)}
                        >
                            <option value="">Continent</option>
                            <option value="AFRICA">Africa</option>
                            <option value="EUROPE">Europe</option>
                        </select>
                    </div>
                </div>
                <div className="sm:col-span-3 flex items-center">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Currency
                    </label>
                    <div className="mt-2 flex-1">
                        <select
                            id="currency"
                            name="currency"
                            placeholder={data.currency}
                            onChange={(e)=>setCurrency(e.target.value)}
                            className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        >
                            <option value="0">Currency</option>
                            <option value="USD">USD</option>
                            <option value="ZWG">ZWG</option>
                        </select>
                    </div>
                </div>
                {
                    user.role === "ADMIN" && 
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Insurance Company
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="insurerId"
                                name="insurerId"
                                onChange={(e) => setInsurerId(Number(e.target.value))}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            >
                                <option value={0}>Select Insurer</option>
                                {insurers && insurers.length > 0 ? (
                                    insurers.map((insurer) => (
                                        <option key={insurer.insurerId} value={insurer.insurerId}>
                                        {insurer.insurerName}
                                        </option>
                                    ))
                                ) : (
                                <option value={0}>No data found</option>
                                )}
                            </select>
                        </div>
                    </div>
                }
                
                <div className="sm:col-span-3 flex items-center">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                        Active State
                    </label>
                    <div className="mt-2 flex-1">
                        <select
                            id="active"
                            name="active"
                            placeholder={data.active?"Active":"Inactive"}
                            onChange={(e)=>setActive(e.target.value)}
                            className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                        >
                            <option value="">{data.active?"Active":"Inactive"}</option>
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
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
