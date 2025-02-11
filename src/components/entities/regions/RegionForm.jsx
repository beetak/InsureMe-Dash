import React, { useEffect, useState } from 'react'
import PageLoading from '../../loadingStates/PageLoading'
import useAuth from '../../../hooks/useAuth'
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi'

export default function RegionForm() {

    const { user, setUser } = useAuth()

    useEffect(() => {
        setupInterceptors(() => user, setUser)
    },[])

    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState([])

    const handlePost = async (e) => {
        e.preventDefault()

        const postData = {
            
        }
        if(name===""){
            setError({err: 'empty', message: 'Please provide the description'})
            setTimeout(()=>{
                setError("")
            },2000)
        }
        else{
            setLoading(true)
            try{
                const response = await InsuranceApi.post('/region', {
                    region: {
                        name
                    }
                })
                if(response.data){
                    setSuccess(true)
                }
                else{
                    setFailed(true)
                }
            }
            catch(e){
                setFailed(true)
            }
            finally{
                setTimeout(()=>{
                    setLoading(false)
                    setSuccess(false)
                    setFailed(false)
                    setName("")
                }, 1000)
            }
        }
    }

    return (
        <>
            {
                loading && <PageLoading loading={loading} success={success} failed={failed}/>
            }
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                <h2 className="text-lg font-semibold">Region Creation Form</h2>
                <p className="text-xs mb-4">For vehicle Insurance processing</p>
                <div className='space-y-1'>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Name
                        </label>
                        <div className="mt-2 flex-1">
                            {
                                error.err==="empty"&&<h6 className='text-red-500 mb-1'>{error.message}</h6>
                            }
                            <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="family-name"
                            placeholder='Region Name'
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
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
