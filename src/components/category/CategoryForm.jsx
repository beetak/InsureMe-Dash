import React, { useState } from 'react'
import PageLoading from '../loadingStates/PageLoading'
import IconsModal from './IconsModal'
import InsuranceApi from '../api/InsuranceApi'

export default function CategoryForm() {

    const [description, setDescription] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const [iconUrl, setIconUrl] = useState('')
    const [iName, setIName] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState([])
    const [viewOpen, setViewOpen] = useState(false)

    const handlePost = async (e) => {
        e.preventDefault()
        if(categoryName===""&&description===""&&iconUrl===""){
            const newError = { err: 'empty', message: 'Please provide all fields' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
        }
        else{
            if(description===""){
                const newError = { err: 'description', message: 'Please provide the description' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(categoryName===""){
                const newError = { err: 'category', message: 'Please provide the category' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(iconUrl===""){
                const newError = { err: 'icon', message: 'Please select an icon' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            else if(categoryName!==""&&description!==""&&iconUrl!==""){
                setLoading(true)
                const postData = {
                    categoryName,
                    description,
                    iconUrl,
                    isActive: true
                }
                const response = await InsuranceApi.post(`/categories`,postData)
                console.log("post results: ", response)
                if(response.data.httpStatus==="CREATED"){
                    setSuccess(true)
                }
                else{
                    setFailed(true)
                }
                setTimeout(()=>{
                    setLoading(false)
                    setSuccess(false)
                    setFailed(false)
                    setDescription("")
                    setCategoryName("")
                    setIconUrl("")
                    setIName("")
                }, 2000)
            }
        }
    }

    const getViewModal =(isOpen)=>{
        setViewOpen(isOpen)
    }
    const getIcon =(iconName, iconClass)=>{
        setIName(iconName)
        setIconUrl(iconClass)
    }
            
    return (
        <>
            {
                loading && <PageLoading loading={loading} success={success} failed={failed}/>
            }
            {
                viewOpen&& <IconsModal setModal={getViewModal} setIcon={getIcon}/>
            }
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                <h2 className="text-lg font-semibold">Insurance Category Creation Form</h2>
                <p className="text-xs mb-4">For use on creating insurance products</p>
                <div className='space-y-1'>
                    {
                        Object.keys(error).length>0&&
                        error.map((error, index) => {
                            if (error.err === "empty") {
                                return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                            }
                            return null;
                        })
                    }
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Category Name
                        </label>
                        
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "category") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                id="name"
                                autoComplete="family-name"
                                placeholder='Category Name'
                                name="categoryName" 
                                value={categoryName}
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
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "description") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                id="description"
                                autoComplete="family-name"
                                placeholder='Insurance Type'
                                name="description" 
                                value={description}
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
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "icon") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <button
                                onClick={()=>{
                                    setViewOpen(true)
                                  }}
                                className={`border border-gray-300 rounded-sm px-3 py-2 text-left text-gray-700 bg-white w-full`}
                            >
                                {iName?'Selected Icon: ':'Select Icon'} {iName&&<span>{iName}</span>}
                            </button>
                        </div>
                        {/* <div className="mt-2 flex-1">
                            {
                                error.err==="empty"&&<h6 className='text-red-500 mb-1'>{error.message}</h6>
                            }
                            <input
                                type="text"
                                id="iconUrl"
                                autoComplete="family-name"
                                placeholder='Icon Name'
                                name="iconUrl" 
                                value={iconUrl}
                                onChange={(e)=>setIconUrl(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div> */}
                    </div>
                </div>
                <div className='flex space-x-2 pt-10'>
                    <button
                        onClick={handlePost}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                        Submit
                    </button>
                    <button
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    )
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
  }
  