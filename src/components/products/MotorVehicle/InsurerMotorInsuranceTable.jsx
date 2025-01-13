import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getInsurers } from '../../../store/insurer-store';
import { ScaleLoader } from 'react-spinners';
import { deleteVehicleInsurance, fetchAsyncVehicleInsuranace, fetchAsyncVehicleInsuranceByInsurer, getVehicleInsurance } from '../../../store/vehicle-store';
import MotorInsuranceModal from './MotorInsuranceModal';
import MotorInsuranceViewModal from './MotorInsuranceViewModal';

const insuranceCompany = localStorage.getItem('insuranceCompany')

export default function InsurerMotorInsuranceTable() {

  const [catResponse, setCatResponse] = useState('')
  const [message, setMessage] = useState('')
  const [prodResponse, setProdResponse] = useState('')
  const [insurerResponse, setInsurerResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  
  const dispatch = useDispatch()  

  const vehicleInsurance = useSelector(getVehicleInsurance)
  const insurers = useSelector(getInsurers)

  useEffect(()=>{
    setLoading(true)
    let insurerId
    if(insuranceCompany){
      insurerId = insuranceCompany
    }
    else{
      insurerId = 1
    }
    dispatch(fetchAsyncVehicleInsuranceByInsurer({insurerId}))
    .then((res)=>{
      if(!res.payload.success){
        setLoading(false)
        setProdResponse("Error fetching resource, Please check your network connection")
      }
      else if(res.payload.success&&!res.payload.data){
        setLoading(false)
        setProdResponse("No Product found")
      }
    })
    .finally(()=>{
      setLoading(false)
    })
  },[dispatch])

  const getInsurerProducts = (insurerId) => {
    setMessage("Loading...")
    dispatch(fetchAsyncVehicleInsuranceByInsurer({insurerId}))
    .then((response)=>{
      console.log("respo: ", response)
    })
    .catch(()=>{

    })
  }

  const handleDelete = (insuranceId) => {
    setLoading(true)
    setMessage("Deleting...")
    dispatch(deleteVehicleInsurance({
        insuranceId
    }))
    .then((response)=>{
      if(response.payload&&response.payload.success){
        
      }
      else{
          setLoading(true)
      }            
    })
    .finally(()=>{
      dispatch(fetchAsyncVehicleInsuranace())
      .then(()=>{
        setLoading(false)
      })
    })
  }
    
  const renderTableHeader = () => {
    const columns = [
      { key: 'item', label: '#', width: "1" },
      { key: 'name', label: 'Policy' },
      { key: 'class', label: 'Vehicle Class' },
      { key: 'price', label: 'Price' },
      { key: 'insurerName', label: 'Insurer Name' },
      // { key: 'datecreated', label: 'Date Created' },
      { key: 'status', label: 'Policy Status' },
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
        <h1 className='flex text-gray-700 justify-center'>{message}</h1>
      </td>
    </tr>
  }

  function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
  }

  console.log("my products ",vehicleInsurance)
  const renderTableRows = () => {
    return vehicleInsurance?vehicleInsurance.map((item, index) => (
      <tr key={index} className={`${index%2!==0&&" bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
        <td className='font-bold text-blue-5 justify-center items-center w-7'><div className='w-full justify-center flex items-center'>{++index}</div></td>
        <td>{item.policyTypeName}</td>
        <td>{item.vehicleClassName}</td>
        <td>{item.insurancePrice }</td>
        <td>{item.insurerName }</td>
        {/* <td>{formatDate(item.createdAt)}</td> */}
        <td className=''><div className='w-full justify-center flex items-center'> <span className={` font-semibold uppercase text-xs tracking-wider px-3 text-white ${item.isActive?" bg-green-600": " bg-red-600 "} rounded-full py-1`}>{item.isActive?"Active":"Inactive"}</span></div></td>
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
                ()=>
                  handleDelete(item.insuranceId)
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
      <td colSpan={7} style={{ textAlign: 'center' }}>{prodResponse}</td>
    </tr>  
  };

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
          isOpen&& <MotorInsuranceModal setModal={getModal} data={modalData}/>
        }
        {
          viewOpen&& <MotorInsuranceViewModal setModal={getViewModal} data={modalData}/>
        }
        <h2 className="text-lg font-semibold">Insurance Type Data</h2>
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
