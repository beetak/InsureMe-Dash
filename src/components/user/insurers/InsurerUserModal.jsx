import React, { useEffect, useState } from 'react'
import Modal from '../../modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { getInsurers } from '../../../store/insurer-store';
import useAuth from '../../../hooks/useAuth';
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi';

export default function InsurerUserModal(props) {

    const { user, setUser } = useAuth()

    useEffect(() => {
        setupInterceptors(() => user, setUser)
    },[])

    const [insurerName, setInsurerName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [email, setEmail] = useState("")
    const [insuerId, setInsurerId] = useState("")
    const [title, setTitle] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState([])

    const [close, setClose] = useState(false)

    const insurers = useSelector(getInsurers)

    useEffect(() => {
        setFirstName(props.data.firstName)
        setLastName(props.data.lastName)
        setEmail(props.data.email)
        setPhoneNumber(props.data.phoneNumber)
    },[])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await InsuranceApi.put(`/insurer-users/${props.id}`)
            if (response.success) {
                setSuccess(true)
                refresh()
            } else {
                setFailed(true)
            }
        } catch (err) {
            setFailed(true)
            setError([{ err: "submit", message: "Error submitting form. Please try again." }])
            } finally {
            setLoading(false)
            setTimeout(() => {
                setSuccess(false)
                setFailed(false)
                setError([])
            }, 3000)
        }
    }

    const getModal =(isOpen)=>{
        props.setModal(isOpen)
    }

    return (
        <>
            <Modal setModal={getModal}>
                <h2 className="text-lg font-semibold">Insurance Company Details Modification</h2>
                <p className="text-xs mb-4">Edit Fields</p>
                <div className='space-y-1'>
                <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Firstname(s)
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            autoComplete="family-name"
                            placeholder='First Name'
                            value={firstName}
                            onChange={(e)=>setFirstName(e.target.value)}
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Lastname
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            autoComplete="family-name"
                            placeholder='Surname'
                            value={lastName}
                            onChange={(e)=>setLastName(e.target.value)}
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Job Title
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                autoComplete="family-name"
                                placeholder='Job Title'
                                value={title}
                                onChange={(e)=>setTitle(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Email Address
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="adon"
                                id="adon"
                                autoComplete="family-name"
                                placeholder='Email Address'
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Phone Number
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="phoneNumber"
                                id="phoneNumber"
                                autoComplete="family-name"
                                placeholder='Phone Number'
                                value={phoneNumber}
                                onChange={(e)=>setPhoneNumber(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Insurance Company
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="insurerId"
                                name="insurerId"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value="Option 0">Select Insurance Company</option>
                                {
                                    insurers?insurers.map((insurer, index)=>(
                                        <option key={index} onClick={(e)=>setInsurerId(insurer.insurerId)}>{insurer.insurerName}</option>
                                    )):<option value="Option 0">No data found</option>
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className='flex space-x-2 pt-10'>
                    <button
                        onClick={()=>handleSubmit()}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Submit
                    </button>
                    <button
                        onClick={()=>props.setModal(close)}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Cancel
                    </button>
                </div>
            </Modal>
        </>
    )
}
