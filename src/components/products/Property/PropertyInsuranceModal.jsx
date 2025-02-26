import React, { useEffect, useState } from 'react'
import { HashLoader } from 'react-spinners';
import Modal from '../../modal/Modal';
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi';
import { useAuth } from '../../../context/AuthProvider';

export default function PropertyInsuranceModal({ data, refresh, setModal }) {

    const { user, setUser } = useAuth()
    const [insurers, setInsurers] = useState("")

    useEffect(()=>{
        fetchInsurer()
        setupInterceptors(() => user, setUser);
        setPolicy(data.policy)
        setPolicyType(data.policyType)
        setActive(data.active)
        setRate(data.rate)
        setDescription(data.description)
        setInsurerId(data.id)
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

    const [description, setDescription] = useState("");
    const [policy, setPolicy] = useState("");
    const [policyType, setPolicyType] = useState("");
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [close, setClose] = useState(false)
    const [rate, setRate] = useState("")
    const [insurerId, setInsurerId] = useState(0)
    const [active, setActive] = useState(false)



     

    const handleSubmit = async (e) => {
        e.preventDefault()        
        setLoading(true)
        try{
            const response = await InsuranceApi.put(`/property-details/${data.id}`,{
                insurerId,
                policy,
                policyType,
                description,
                rate
            })
            if(response.data&&response.data.httpStatus==="OK"){
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
                setDescription('')
                refresh()
                setModal(close)
            },1000)
        }
    }

    const getModal =(isOpen)=>{
        setModal(isOpen)
    }

    return (
        <>
            <Modal setModal={getModal}>
                <h2 className="text-lg font-semibold">Insurance Category Modification</h2>
                <p className="text-xs mb-4">Edit the description</p>
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
                            Description
                        </label>
                        
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="description"
                                id="description"
                                autoComplete="family-name"
                                placeholder={data.description}
                                onChange={(e)=>setDescription(e.target.value)}
                                className="block w-full rounded-xs bg-transparent border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
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
                            Policy
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="policy"
                                name="policy"
                                placeholder={data.policy}
                                onChange={(e) => setPolicy(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            >
                                <option value="">Select Policy</option>
                                <option value="DOMESTIC_COMBINED_STANDARD_CONSTRUCTION">Domestic Combined Standard Construction</option>
                                <option value="DOMESTIC_COMBINED_NON_STANDARD_CONSTRUCTION">Domestic Combined non Standard Construction</option>
                            </select>
                        </div>
                    </div>
                    {/* Roof Type */}
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Policy Type
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="policyType"
                                name="policyType"
                                placeholder={data.policyType}
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                onChange={(e) => setPolicyType(e.target.value)}
                            >
                                <option className='font-bold italic text-gray-400'>Policy Type</option>
                                <option value="HOUSE_OWNERS">House Owners</option>
                                <option value="HOUSE_HOLDERS">House Holders</option>
                                <option value="ALL_RISK">All Risk</option>
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Premium %
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="rate"
                                id="rate"
                                autoComplete="family-name"
                                placeholder={data.rate}
                                onChange={(e)=>setRate(e.target.value)}
                                className="block w-full rounded-xs bg-transparent border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Active State
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                                onChange={(e) => setActive(e.target.value)}
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
                    Update
                    </button>
                    <button
                        onClick={()=>setModal(close)}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Cancel
                    </button>
                </div>
            </Modal>
        </>
    )
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}
