import React, { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners'
import useAuth from '../../../hooks/useAuth'
import InsuranceApi from '../../api/InsuranceApi'

export default function CustomersTable() {

    const {user} = useAuth()
    const {accessToken} = user

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }

    const [customerResponse, setCustomerResponse] = useState('')
    const [loading, setLoading] = useState(false)
    const [customers, setCustomers] = useState('')
  
    useEffect(()=>{
        fetchCustomers()
    },[])

    const fetchCustomers = async () => {
        setLoading(true)
        try{
            const response = await InsuranceApi.get('/town', {headers})
            if(response&&response.data){
                console.log(response.data)
                setCustomers(response.data.data)
            }
        }
        catch(err){
            console.log(error)
            if(err){
                setCustomerResponse("Error fetching resource, Please check your network connection")
            }
            else if(err){
                setCustomerResponse("No Categories found")
            }
        }
        finally{
        setLoading(false)
        }
    }
      
    const renderTableHeader = () => {
      const columns = [
        { key: 'item', label: '#', width: "1" },
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Email Address' },
        { key: 'price', label: 'Phone Number' },
        { key: 'datecreated', label: 'First Seen' },
        { key: 'status', label: 'D.O.B' },
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
    
        return customers?customers.map((item, index) => (
        <tr key={index} className={`${index%2!==0&&" bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
            <td className='font-bold text-blue-5 justify-center items-center w-7'><div className='w-full justify-center flex items-center'>{++index}</div></td>
            <td>{item.productName}</td>
            <td>{item.categoryId}</td>
            <td>{item.price }</td>
            <td>Undefined</td>
            <td className=''><div className='w-full justify-center flex items-center'> <span className={` font-semibold uppercase text-xs tracking-wider px-3 text-white ${item.statusCode?" bg-green-600": " bg-red-600 "} rounded-full py-1`}>{item.statusCode?"Active":"Inactive"}</span></div></td>
            <td className='py-1 space-x-0 justify-center'>
            <div className='w-full justify-center flex items-center'>
                <button
                onClick={
                    ()=>{
                    printVouchers()
                    dispatch(navActions.toggleInvoice(false))
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
                    printVouchers()
                    dispatch(navActions.toggleInvoice(false))
                    }
                }
                className={`space-x-2 border-gray-300 rounded-r-full px-4 h-6 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                >
                <i className='fas fa-pen text-xs'/>
                <span className='text-xs'>Update</span>
                </button>
            </div>  
            </td>
        </tr>
        )):
        <tr className=''>
        <td colSpan={7} style={{ textAlign: 'center' }}>{customerResponse}</td>
        </tr>
        
    };
  
    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                <h2 className="text-lg font-semibold">Customers Table</h2>
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
                    <div className="flex items-center space-x-2">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Policy
                    </label>
                    <div className="">
                        <select
                        id="systemAdOns"
                        name="systemAdOns"
                        className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5"
                        >
                        <option value="5">Policy Type</option>
                        {
                            customers?customers.map((category, index)=>(
                            <option value="5">{category.description}</option>
                            )):<option value="5">No Categories</option>
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