import React, { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners';
import { deleteTown, fetchAsyncTowns } from '../../../store/entity-store';
import TownViewModal from './TownViewModal';
import TownModal from './TownModal';
import DeleteConfirmationModal from '../../deleteConfirmation/deleteConfirmationModal';
import useAuth from '../../../hooks/useAuth';
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi';

export default function TownsTable() {

    const { user, setUser } = useAuth()

    useEffect(()=>{
        setupInterceptors(() => user, setUser)
    },[])

    const [townResponse, setTownResponse] = useState('')
    const [modalData, setModalData] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [itemId, setItemId] = useState('')
    const [isDelete, setIsDelete] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const [towns, setTowns] = useState('')
  
    useEffect(()=>{
        fetchTowns()
    },[])

    const fetchTowns = async () => {
        setLoading(true)
        try{
            const response = await InsuranceApi.get('/town')
            if(response.data.code==="OK"&&response.data.data!==null){
                setTowns(response.data.data)
            }
            else if (response.data.code==="NOT_FOUND"){
                setTownResponse("No Towns found")
            }
        }
        catch(err){
            console.log(err)
            if(err){
                setTownResponse("Error fetching resource, Please check your network connection")
            }
            else if(err){
                setTownResponse("No Categories found")
            }
        }
        finally{
        setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        setLoading(true)
        setIsDelete(true)
        try{
            const response = await InsuranceApi.delete(`/town/${id}`)
            if(response&&response.data.code==="OK"){
                setMessage("Deleted")
            }
          }
          catch(err){
              console.log(err)
          }
          finally{
            setTimeout(()=>{
                setLoading(false)
                setIsDelete(false)
                setMessage('')
            },1000)
            fetchTowns()
        }
    }

    const renderTableHeader = () => {
        const columns = [
            { key: 'item', label: '#', width: 1 },
            { key: 'name', label: 'Town' },
            { key: 'name', label: 'Parent Region' },
            { key: 'datecreated', label: 'Date Created' },
            { key: 'status', label: 'Status' },
            { key: 'action', label: 'Action' },
        ];

        return columns.map((column) => (
            <th key={column.key} className={`text-sm font-bold tracking-wide text-left ${column.width ? "p-3 w-" + column.width : "py-3"} ${column.key === 'status' && "text-center"} ${column.key === 'action' && "text-center"}`}>
              <span className="mr-2">{column.label}</span>            
            </th>
        ));
    };

    const loadingAnimation = () => {
        return <tr>
            <td colSpan={7} style={{ textAlign: 'center' }} className='py-3'>
                <ScaleLoader
                    color='#374151'
                    loading={loading}
                    cssOverride={override}
                    size={10} // Adjust the size as needed
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
                <h1 className='flex text-gray-700 justify-center'>Loading</h1>
            </td>
        </tr>
      }
    

    const renderTableRows = () => {
        return towns?towns.map((item, index) => (
            <tr key={index} className={`${index%2!==0&&" bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
                <td className='font-bold text-blue-5 justify-center items-center w-7'><div className='w-full justify-center flex items-center'>{++index}</div></td>
                <td>{item.name}</td>
                <td>{item.regionName}</td>
                <td>{formatDate(item.dateCreated)}</td>
                <td className=''><div className='w-full justify-center flex items-center'> <span className={` font-semibold uppercase text-xs tracking-wider px-3 text-white ${item.active?" bg-green-600": " bg-red-600 "} rounded-full py-1`}>{item.active?"Active":"Inactive"}</span></div></td>
                <td className='py-1 space-x-0 justify-center'>
                    <div className='w-full justify-center flex items-center'>
                        <button
                            onClick={
                                ()=>{
                                setModalData(item)
                                setViewOpen(true)
                                }
                            }
                            className={`space-x-2 items-center border-gray-300 rounded-l-full px-4 h-6 m bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                        >
                            <i className='fas fa-eye text-xs'/>
                            <span className='text-xs'>View</span>
                        </button>                  
                        <button
                            onClick={
                                ()=>{
                                setModalData(item)
                                setIsOpen(true)
                                }
                            }
                            className={`space-x-2 border-gray-300 items-center px-4 h-6 bg-blue-500 text-gray-100 hover:text-blue-500 hover:bg-white`}
                        >
                            <i className='fas fa-pen text-xs'/>
                            <span className='text-xs'>Update</span>
                        </button>
                        <button
                            onClick={
                                ()=>{
                                    setItemId(item.id)
                                    setIsDelete(true)
                                  }
                            }
                            className={`space-x-2 border-gray-300 items-center rounded-r-full px-4 h-6 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                        >
                            <i className='fas fa-trash text-xs'/>
                            <span className='text-xs'>Delete</span>
                        </button>
                    </div>  
                </td>
            </tr>
        )):
        <tr className=''>
          <td colSpan={7} style={{ textAlign: 'center' }}>{townResponse}</td>
        </tr>
    };

    function formatDate(dateString) {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        return formattedDate;
    }

    const getModal =(isOpen)=>{
        setIsOpen(isOpen)
    }
    const getViewModal =(isOpen)=>{
        setViewOpen(isOpen)
    }
    
    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                {
                    isOpen&& <TownModal setModal={getModal} data={modalData} refresh={fetchTowns}/>
                }
                {
                    viewOpen&& <TownViewModal setModal={getViewModal} data={modalData}/>
                }
                {
                    isDelete&& <DeleteConfirmationModal deleteOpen={isDelete} onClose={()=>setIsDelete(false)} onDelete={()=>handleDelete(itemId)}/>
                }
                <h2 className="text-lg font-semibold">Town Data</h2>
                <div className='flex justify-between py-4'>
                    <div className="xl:col-span-3 flex items-center space-x-2">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Show
                        </label>
                        <div className="">
                            <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="All">All</option>
                            </select>
                        </div>
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Entries
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="text"
                            name="adon"
                            id="adon"
                            autoComplete="family-name"
                            placeholder='Search'
                            className="rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div className='overflow-auto rounded:xl shadow-md'>
                    <table className='w-full'>
                        <thead className='bg-gray-100 border-b-2 border-gray-300'>
                            <tr >{renderTableHeader()}</tr>
                        </thead>
                        <tbody >{loading?loadingAnimation():renderTableRows()}</tbody>
                    </table>
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