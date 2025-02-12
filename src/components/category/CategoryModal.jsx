import React, { useEffect, useState } from 'react'
import Modal from '../modal/Modal';
import { HashLoader } from 'react-spinners';
import icons from './icons.json'
import useAuth from '../../hooks/useAuth';
import InsuranceApi, { setupInterceptors } from '../api/InsuranceApi';

export default function CategoryModal({ data, refresh, setModal }) {

    const { user, setUser } = useAuth()

    useEffect(() => {
        setupInterceptors(()=>user, setUser)
        setCategoryName(data.categoryName)
        setDescription(data.description)
        setIconUrl(data.iconUrl)
        setIsActive(data.isActive)
    }, [data])

    const [description, setDescription] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [isActive, setIsActive] = useState("");
    const [iconName, setIconName] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [showIcons, setShowIcons] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [close, setClose] = useState(false)

     

    const handleSubmit = async (e) => {
        e.preventDefault()        
        setLoading(true)
        try{
            const response = await InsuranceApi.put(`/categories/${data.categoryId}`,{
                categoryName,
                description,
                iconUrl,
                isActive
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
                            Category Name
                        </label>
                        
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                id="categoryName"
                                autoComplete="family-name"
                                placeholder={data.categoryName}
                                name="categoryName"
                                onChange={(e)=>setCategoryName(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Description
                        </label>
                        
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                id="name"
                                autoComplete="family-name"
                                placeholder={data.description}
                                name="description"
                                onChange={(e)=>setDescription(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Icon
                        </label>
                        <div className="mt-2 flex-1">
                            <button
                                onClick={()=>setShowIcons(true)}
                                className={`border border-gray-300 rounded-sm px-3 py-2 text-left text-gray-700 bg-white w-full`}
                            >
                                {iconName?'Selected Icon: ':'Select Icon'} {iconName&&<span>{iconName}</span>}
                            </button>
                        </div>
                    </div>
                    {
                        showIcons&&
                        <div className="sm:col-span-3 flex justify-end">
                            <div className="mt-2 w-5/6">
                                <div className="flex overflow-x-auto">
                                    <div className="flex space-x-2 pb-4">
                                    {icons.map((icon, index) => (
                                        <div
                                        key={index}
                                        onClick={() => {
                                            setIconName(icon.name)
                                            setIconUrl(icon.class)
                                            setShowIcons(false);
                                        }}
                                        className="flex flex-col justify-center items-center cursor-pointer"
                                        >
                                        <i className={`${icon.class}`}></i>
                                        <p className="bg-gray-300 px-2 rounded-xl w-20 text-center mt-2">{icon.name}</p>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Active State
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value="">{data.isActive?"Active":"Inactive"}</option>
                                <option onClick={()=>setIsActive(true)}>Active</option>
                                <option onClick={()=>setIsActive(false)}>Inactive</option>
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
