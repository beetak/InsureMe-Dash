import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import CategoryModal from '../category/CategoryModal';
import CategoryViewModal from '../category/CategoryViewModal';
import { fetchAsyncRegions, fetchShopsByTownId, fetchTownsByRegionId, getRegions, getShops, getTowns } from '../../store/entity-store';
import { authActions, fetchUserByShopId, findUserLike, getUsers } from '../../store/user-store';
import { fetchSalesByDateRange } from '../../store/payments-store';
import { fetchAsyncInsurer, getInsurers } from '../../store/insurer-store';
import useAuth from '../../hooks/useAuth';
import InsuranceApi from '../api/InsuranceApi';

export default function InsurerSales() {

    const {user} = useAuth()

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [sales, setSales] = useState("")
    const [insurers, setInsurers] = useState("")
    const [insurerId, setInsurerId] = useState("")

    useEffect(()=>{
        fetchInsurer()
    },[])

    const handleSearch = async() => {
        setLoading(true)
        setMessage("Loading, Please wait a moment");
        setSales('')
        const formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
        const formattedEndDate = new Date(endDate).toISOString().slice(0, 10);
        try{
            const response = await InsuranceApi.get(`/product-payments/by-insurer/${insurerId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
            console.log("post results: ", response)
            if(response.data.code==="OK"&&response.data.data.length>0){
                setSales(response.data.data);
                setLoading(true)
            }
            else if(response.data.code==="NOT_FOUND"){
                setMessage("No sales record found")
            }
            else{
                setLoading(false)
                setMessage("Error Fetching Resource")
            }
        }
        catch(err){
            setLoading(false)
            setMessage("Error Fetching Resource")
        }
        finally{
            setTimeout(()=>{
                setLoading(false)
            },1000)
        }
    }

    const fetchInsurer = async () => {
        setLoading(true)
        try{
          const response = await InsuranceApi.get('/insurers')
          if(response){
            console.log(response)
            setInsurers(response.data.data)
          }
        }
        catch(err){
            console.log(error)
        }
        finally{
          setLoading(false)
        }
    }
        
    const renderTableHeader = () => {
        const columns = [
          { key: 'item', label: '#', width: "1" },
          { key: 'policy', label: 'Policy Name' },
          {
            key: 'revenue',
            label: 'Revenue Collections',
            subHeaders: [
              { key: 'ZWG', label: 'ZWG' },
              { key: 'USD', label: 'USD' },
            ],
          },
        ];
      
        return columns.map((column) => (
          <th
            key={column.key}
            className={`text-sm font-bold tracking-wide text-left ${column.width ? "p-3 w-" + column.width : "py-3"} ${column.key === 'revenue' && "text-end"} ${column.key === 'action' && "text-center"}`}
          >
            <span className={`mr-2 ${column.key === 'revenue' && "pr-3"}`}>{column.label}</span>
            {column.subHeaders && (
                <div className="flex w-full">
                    {column.subHeaders.map((subHeader) => (
                        <div key={subHeader.key} className="flex-1 text-xs font-semibold text-right pr-5">
                            {subHeader.label}
                        </div>
                    ))}
                </div>
            )}
          </th>
        ));
    };

    const loadingAnimation = () => {
        return <div className='flex justify-center'>
            <span style={{ textAlign: 'center' }} className='py-3'>
                <ScaleLoader
                    color='#374151'
                    loading={loading}
                    cssOverride={override}
                    size={10} // Adjust the size as needed
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
                <h1 className='flex text-gray-700 justify-center'>{message}</h1>
            </span>
        </div>
    }

    const renderTableRows = () => {
        return sales ? sales.map((item, index) => (
            <tr key={index} className={`${index % 2 !== 0 && " bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
                <td className='font-bold text-blue-5 justify-center items-center w-7'>
                    <div className='w-full justify-center flex items-center'>{index + 1}</div>
                </td>
                <td>{item.insuranceCategory}</td>
                <td>
                    <div className="flex w-full justify-around">
                        <div className="flex-1 text-xs font-semibold text-right pr-5">
                            {item.amounts.ZWG?item.amounts.ZWG:""}
                        </div>
                        <div className="flex-1 text-xs font-semibold text-right pr-5">
                            {item.amounts.USD?item.amounts.USD:""}
                        </div>
                    </div>
                </td>
            </tr>
        )) : (
            <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>{message || "Error fetching resource"}</td>
            </tr>
        );
    };

    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                <h2 className="text-lg font-semibold">Insurer Sales Report</h2>
                <div className='flex-col py-4 space-y-2'>
                    <div className="grid grid-cols-4 items-center justify-between rounded-full border border-gray-400 gap-2">
                        <div className="flex rounded-full p-1 px-2 border-r border-gray-400">
                            <h6 className='mr-3'>Start Date:</h6>
                            <DatePicker
                                showPopperArrow
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                maxDate={new Date()}
                                className='w-[105px] outline-none rounded-3xl bg-gray-200 px-3 cursor-pointer'
                            />
                        </div>
                        <div className="flex rounded-full p-1 px-2 border-r border-gray-400">
                            <h6 className='mr-3'>End Date:</h6>
                            <DatePicker
                                showPopperArrow
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                maxDate={new Date()}
                                className='w-[105px] outline-none rounded-3xl bg-gray-200 px-3 cursor-pointer'
                            />
                        </div>
                        <div className="flex rounded-full p-1 px-2 border-r border-gray-400">
                            <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className=" bg-inherit rounded-xs cursor-pointer"
                            >
                                <option value="5">Transaction Status</option>
                                <option value="5">Successful Transactions</option>
                                <option value="5">Failed Transactions</option>
                            </select>
                        </div>
                        <div className="flex p-1 px-2">
                            <select
                                id="insurerId"
                                name="insurerId"
                                value={insurerId}
                                onChange={(e) => setInsurerId(Number(e.target.value))}
                                className=" bg-inherit rounded-xs cursor-pointer"
                            >
                                <option value={0}>Select Insurer</option>
                                {insurers ? (
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
                    <div className="flex items-center justify-between space-x-2">
                        <div className='w-full flex space-x-2 items-center'>
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Show
                            </label>
                            <div className="">
                                <select
                                    id="systemAdOns"
                                    name="systemAdOns"
                                    className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5 cursor-pointer"
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
                        <div className='flex justify-end w-56'>
                            <button
                                onClick={
                                    ()=>handleSearch()
                                }
                                className={`space-x-2 border-gray-300 rounded-l-full px-3 h-8 items-center bg-blue-500 text-gray-100 hover:bg-blue-600`}
                            >
                                <i className='fas fa-search text-xs'/>
                                <span className='text-xs'>Search</span>
                            </button>
                            <button
                                onClick={
                                    ()=>printDocument()
                                }
                                className={`space-x-2 border-gray-300 rounded-r-full px-3 h-8 items-center bg-gray-500 text-gray-100 hover:bg-gray-600`}
                            >
                                <i className='fas fa-print text-xs'/>
                                <span className='text-xs'>Print</span>
                            </button>
                        </div>
                    </div>
                </div>
                {
                    loading ? 
                    (
                        loadingAnimation()
                    ) : 
                    (
                        <>
                            {
                                sales?                    
                                <div className='overflow-auto rounded:xl shadow-md'>
                                    <table className='w-full'>
                                            <thead className='bg-gray-100 border-b-2 border-gray-300'>
                                                <tr >{renderTableHeader()}</tr>
                                            </thead>
                                            <tbody >{loading?loadingAnimation():renderTableRows()}</tbody>
                                    </table>
                                </div>
                                :
                                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <div className="flex flex-col">
                                        <div className=" bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
                                            <div className="flex justify-center items-center bg-gray-700 text-white">
                                                <span className="font-semibold">Enter date range and click search</span>
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                            }
                        </>
                    ) 
                }
            </div>
        </>
    )
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}
