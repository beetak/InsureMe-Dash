import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCategories } from '../../store/category-store'
import { postAddOn } from '../../store/addon-store';
import { postInsurance } from '../../store/product-store';
import PageLoading from '../loadingStates/PageLoading';
import { postPolicy } from '../../store/policy-store';
import useAuth from '../../hooks/useAuth';
import InsuranceApi from '../api/InsuranceApi';

export default function PolicyForm() {

    const {user} = useAuth()
    const{ userId, accessToken} = user

    const [policyTypeName, setPolicyTypeName] = useState("");
    const [policyTypeDescription, setPolicyTypeDescription] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState([])
    const [categories, setCategories] = useState([])
    const [catResponse, setCatResponse] = useState('')

    useEffect(() => {
        fetchCategory()
      }, []);
    
      const fetchCategory = async () => {
        setLoading(true)
        try{
            const response = await InsuranceApi.get('/categories')
            if(response&&response.data){
                console.log(response.data)
                setCategories(response.data.data)
            }
        }
        catch(err){
            console.log(error)
            if(err){
              setCatResponse("Error fetching resource, Please check your network connection")
            }
            else if(err){
              setCatResponse("No Categories found")
            }
        }
        finally{
          setLoading(false)
        }
      }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(policyTypeName===""&&policyTypeDescription===""&&categoryId===0){
            const newError = { err: 'empty', message: 'Please provide all fields' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
        }
        else {
            if(policyTypeName===""){
                const newError = { err: 'policy', message: 'Please provide the policy name' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(categoryId===0){
                const newError = { err: 'category', message: 'Please provide the category' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            if(policyTypeDescription===""){
                const newError = { err: 'description', message: 'Please provide the description' };
                setError(prevError => [...prevError, newError]);
                setTimeout(() => {
                    setError(prevError => prevError.filter(error => error !== newError));
                }, 2000);
            }
            else if(policyTypeName!==""&&categoryId!==0&&policyTypeDescription!==""){
                setLoading(true)
                const postData = {
                    policyTypeName,
                    categoryId,
                    policyTypeDescription,
                    isActive: true
                }
                const response = await InsuranceApi.post(`/policy-types`,postData)
                console.log("post results: ", response)
                if(response.status===200){
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

    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                {
                    loading && <PageLoading loading={loading} failed={failed} success={success}/> 
                } 
                <h2 className="text-lg font-semibold">Policy Creation Form</h2>
                <p className="text-xs mb-4">For vehicle Insurance processing</p>
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
                            Policy Name
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                Object.keys(error).length>0&&
                                error.map((error, index) => {
                                    if (error.err === "policy") {
                                        return <h6 key={index} className='text-red-500 mb-1'>{error.message}</h6>;
                                    }
                                    return null;
                                })
                            }
                            <input
                                type="text"
                                name="policyType"
                                id="policyType"
                                autoComplete="family-name"
                                placeholder='Policy Type Name'
                                value={policyTypeName}
                                onChange={(e)=>setPolicyTypeName(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Policy Description
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
                                name="policyTypeDescription"
                                id="policyTypeDescription"
                                autoComplete="family-name"
                                placeholder='Policy Description'
                                value={policyTypeDescription}
                                onChange={(e)=>setPolicyTypeDescription(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Policy Category
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
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={categoryId}
                                onChange={(e) => setCategoryId(Number(e.target.value))}
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value={0}>Select Policy Category</option>
                                {categories ? (
                                    categories.map((category) => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </option>
                                    ))
                                ) : (
                                    <option value={0}>No data found</option>
                                )}
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
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                    >
                    Cancel
                    </button>
                </div>
            </div>
        </>
    )
}
