import React, { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners';
import MotorInsuranceModal from './MotorInsuranceModal';
import MotorInsuranceViewModal from './MotorInsuranceViewModal';
import DeleteConfirmationModal from '../../deleteConfirmation/deleteConfirmationModal';
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi';
import useAuth from '../../../hooks/useAuth';

export default function MotorInsuranceTable() {

  const [message, setMessage] = useState('')
  const [prodResponse, setProdResponse] = useState('')
  const [insurerResponse, setInsurerResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [isDelete, setIsDelete] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [vehicleInsurance, setVehicleInsurance] = useState([])
  const [insurers, setInsurers] = useState([])

  const {user, setUser} = useAuth()

  useEffect(()=>{
    setupInterceptors(()=>user, setUser)
    getVehicleProducts()
    getInsuranceCompanies()
  },[]) 

  const getVehicleProducts = async () => {
    setLoading(true)
    const response = await InsuranceApi.get('/vehicle-insurance')
    if (response.data.httpStatus === "OK" && response.data.data.length > 0) {
      setVehicleInsurance(response.data);
    } else if (response.data.httpStatus !== "OK") {
        setProdResponse("Error fetching resource, Please check your network connection");
    } else if (response.data.httpStatus === "OK" && response.data.data.length === 0) {
        setProdResponse("No Product found");
    }
    setLoading(false)
  }

  const getInsuranceCompanies = async () => {
    const response =  await InsuranceApi.get('/insurers')
    console.log(response)
    if (response.data.httpStatus === "OK" && response.data.data.length > 0) {
      setInsurers(response.data);
    } else if (response.data.httpStatus !== "OK") {
        setInsurerResponse("Error fetching resource, Please check your network connection");
    } else if (response.data.httpStatus === "OK" && response.data.data.length === 0) {
        setInsurerResponse("No Insurer found");
    }
  }

  const getInsurerProducts =  async (insurerId) => {
    const response = await InsuranceApi.get(`/vehicle-insurance/${insurerId}`)
    if(response.data){
      setVehicleInsurance(response.data)
    }
  }

  const handleDelete = async (insuranceId) => {
    setLoading(true)
    setMessage("Deleting...")
    try{
      const response = await InsuranceApi.delete(`/vehicle-insurance/${insuranceId}`)
      if(response){
        setMessage("Deleted")
      }
    }
    catch(err){
      console.log(err)
    }
    finally{
      setLoading(false)
    }
  }
    
  const renderTableHeader = () => {
    const columns = [
      { key: 'item', label: '#', width: "1" },
      { key: 'name', label: 'Policy' },
      { key: 'price', label: 'Price' },
      { key: 'insurerName', label: 'Insurer Name' },
      { key: 'datecreated', label: 'Date Created' },
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

  // console.log("my products ", vehicleInsurance)
  console.log("my insurers ", insurers)
  const renderTableRows = () => {
    if (!vehicleInsurance.data || vehicleInsurance.data.length === 0) {
        return (
            <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>
                    {prodResponse || "No products available."}
                </td>
            </tr>
        );
    }

    return vehicleInsurance.data.map((item, index) => (
        <tr key={index} className={`${index % 2 !== 0 && "bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
            <td className='font-bold text-blue-500 justify-center items-center w-7'>
                <div className='w-full justify-center flex items-center'>{++index}</div>
            </td>
            <td>{item.name}</td>
            <td>{item.insurancePrice}</td>
            <td>{item.insurerName}</td>
            <td>{formatDate(item.createdAt)}</td>
            <td>
                <div className='w-full justify-center flex items-center'>
                    <span className={`font-semibold uppercase text-xs tracking-wider px-3 text-white ${item.isActive ? "bg-green-600" : "bg-red-600"} rounded-full py-1`}>
                        {item.isActive ? "Active" : "Inactive"}
                    </span>
                </div>
            </td>
            <td className='py-1 space-x-0 justify-center'>
                <div className='w-full justify-center flex items-center'>
                <button
              onClick={() => {
                setModalData(item)
                setViewOpen(true)
              }}
              className={`${(user.role==="TREASURY_ACCOUNTANT"||user.role==="MANAGER"||user.role==="PRODUCT_MANAGER")? " rounded-full w-32":" rounded-l-full"} space-x-2 items-center border-gray-300 px-4 h-6 m bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
            >
              <i className="fas fa-eye text-xs" />
              <span className="text-xs">View</span>
              </button>
                {
                  (user.role !== "TREASURY_ACCOUNTANT" && user.role !== "MANAGER" && user.role !== "PRODUCT_MANAGER") &&
                  <>
                    <button
                      onClick={() => {
                        setModalData(item)
                        setIsOpen(true)
                      }}
                      className={`space-x-2 border-gray-300 items-center px-4 h-6 bg-blue-500 text-gray-100 hover:text-blue-500 hover:bg-white`}
                    >
                      <i className="fas fa-pen text-xs" />
                      <span className="text-xs">Update</span>
                    </button>
                    <button
                      onClick={() => {
                        setItemId(item.insuranceId)
                        setIsDelete(true)
                      }}
                      className={`space-x-2 border-gray-300 items-center rounded-r-full px-4 h-6 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                    >
                      <i className="fas fa-trash text-xs" />
                      <span className="text-xs">Delete</span>
                    </button>
                  </>
                }
                </div>
            </td>
        </tr>
    ));
  };

  const getModal =(isOpen)=>{
    setIsOpen(isOpen)
  }
  const getViewModal =(isOpen)=>{
    setViewOpen(isOpen)
  }

  function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
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
        {
          isDelete&& <DeleteConfirmationModal deleteOpen={isDelete} onClose={()=>setIsDelete(false)} onDelete={()=>handleDelete(itemId)}/>
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
          <div className={`${(user.role==="TREASURY_ACCOUNTANT"||user.role==="MANAGER"||user.role==="PRODUCT_MANAGER")? "hidden" : ""} flex items-center space-x-2`}>
            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
            Filter By Insurance Company
            </label>
            <div className="">
              <select
                id="systemAdOns"
                name="systemAdOns"
                className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5"
              >
                <option value="5">Select Company</option>
                {
                    insurers.data && insurers.data.length > 0 ? (
                        insurers.data.map((insurer, index) => (
                            <option key={index} onClick={() => getInsurerProducts(insurer.insurerId)}>
                                {insurer.insurerName}
                            </option>
                        ))
                    ) : (
                        <option value="5">{insurerResponse || "No Categories."}</option>
                    )
                }
              </select>
            </div>
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
