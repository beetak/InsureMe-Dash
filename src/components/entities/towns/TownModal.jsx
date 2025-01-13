import React, { useEffect, useState } from 'react'
import Modal from '../../modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { HashLoader } from 'react-spinners';
import { fetchAsyncRegions, getRegions, updateTown } from '../../../store/entity-store';

export default function TownModal(props) {
    console.log("Modal Props ", props)

    const dispatch = useDispatch()

    const [active, setActive] = useState(null);
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [close, setClose] = useState(false)
    const [name, setName] = useState('')
    const [regionId, setRegionId] = useState(0)
    const [regionResponse, setRegionResponse] = useState('')

    const regions = useSelector(getRegions)

    useEffect(()=>{
        dispatch(fetchAsyncRegions())
        .then((res)=>{
            console.log("search response ", res)
            setLoading(false)
            if(!res.payload.success){
                setRegionResponse("Error fetching resource, Please check your network connection")
            }
            else if(res.payload.success&&!res.payload.data){
                setRegionResponse("No Categories found")
            }
            }
        )
        .finally(()=>{
            setLoading(false)
        })
    },[dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault()        
        setLoading(true)
        dispatch(updateTown({            
            id: props.data.id,
            name: name?name:props.data.name,
            active
        }))
        .then((response)=>{
            // console.log("Post response: ", response.payload.data.data.productId)
            if(response.payload&&response.payload.success){
                setSuccess(true)
            }
            else{
                setFailed(true)
            }            
        })
        .finally(()=>{
            setTimeout(()=>{
                setLoading(false)
                setFailed(false)
                setSuccess(false)
                props.setModal(close)
            },2000)
        })
    }

    const getModal =(isOpen)=>{
        props.setModal(isOpen)
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
                            Name
                        </label>
                        <div className="mt-2 flex-1">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="family-name"
                                placeholder='Town Name'
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div> 
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Region
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="regionId"
                                name="regionId"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value="Option 0">Select Parent Region</option>
                                {
                                    regions?regions.map((region, index)=>(
                                        <option key={index} onClick={(e)=>setRegionId(region.id)}>{region.name}</option>
                                    )):<option value="Option 0">No data found</option>
                                }
                            </select>
                        </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                            Active Status
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value="">{props.data.active?"Active":"Inactive"}</option>
                                <option onClick={()=>setActive(true)}>Active</option>
                                <option onClick={()=>setActive(false)}>Inactive</option>
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

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}
