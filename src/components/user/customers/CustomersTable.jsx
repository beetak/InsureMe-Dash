import React, { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners'
import useAuth from '../../../hooks/useAuth'
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi'

export default function CustomersTable() {

    const {user, setUser} = useAuth()

    const [customerResponse, setCustomerResponse] = useState('')
    const [loading, setLoading] = useState(false)
    const [customers, setCustomers] = useState('')

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(()=>{
        setupInterceptors(() => user, setUser)
        fetchCustomers()
    },[user, setUser])
    
    useEffect(() => {
        setTotalPages(Math.ceil(customers.length / itemsPerPage))
    }, [customers, itemsPerPage])

    const fetchCustomers = async () => {
        setLoading(true)
        try{
            const response = await InsuranceApi.get('/clients/current-day')
            if(response&&response.data){
                console.log(response.data)
                setCustomers(response.data.data)
            }
            else{
                setCustomerResponse("No Customers found")
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
        { key: 'name', label: 'Username' },
        { key: 'fullname', label: 'Fullname' },
        { key: 'phone', label: 'Phone Number' }
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
        if (!customers || customers.length === 0) {
            return (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  {customerResponse || "No customers available."}
                </td>
              </tr>
            )
          }
      
          const indexOfLastItem = currentPage * itemsPerPage
          const indexOfFirstItem = indexOfLastItem - itemsPerPage
          const currentItems = customers.slice(indexOfFirstItem, indexOfLastItem)
      
          return currentItems.map((item, index) => (
            <tr
              key={index}
              className={`${index % 2 !== 0 ? "bg-gray-100" : ""} p-3 text-sm text-gray-600 font-semibold`}
            >
                <td className="font-bold text-blue-500 justify-center items-center w-7">
                    <div className="w-full justify-center flex items-center">{index + 1 + (currentPage - 1) * itemsPerPage}</div>
                </td>
            <td>{item.username}</td>
            <td>{item.fullName}</td>
            <td>{item.phoneNumber }</td>
        </tr>
        ))        
    };

    const handleItemsPerPageChange = (e) => {
        const value = e.target.value
        setItemsPerPage(value === "All" ? customers.length : Number.parseInt(value))
        setCurrentPage(1)
    }

    const renderPagination = () => {
        const pageNumbers = []
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
    
        return (
          <div className="flex justify-center mt-4">
            <nav>
              <ul className="flex">
                {pageNumbers.map((number) => (
                  <li key={number} className="mx-1">
                    <button
                      onClick={() => setCurrentPage(number)}
                      className={`px-3 py-1 rounded-full ${currentPage === number ? "bg-main-color text-white" : "bg-gray-200"}`}
                    >
                      {number}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )
    }
  
    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                <h2 className="text-lg font-semibold">Customers Table</h2>
                <div className='flex justify-between py-4'>
                    <div className="flex items-center rounded-full border overflow-hidden border-gray-500 text-xs h-8">
                        <label
                            htmlFor="itemsPerPage"
                            className="w-16 font-medium leading-6 px-2 py-1 bg-gray-500 justify-center flex text-white"
                        >
                            Show
                        </label>
                        <div className="">
                            <select
                                id="itemsPerPage"
                                name="itemsPerPage"
                                className="bg-inherit px-3 py-1 cursor-pointer"
                                onChange={handleItemsPerPageChange}
                                value={itemsPerPage}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="All">All</option>
                            </select>
                        </div>
                        <label
                            htmlFor="itemsPerPage"
                            className="w-16 font-medium leading-6 px-2 py-1 bg-gray-500 justify-center flex text-white"
                        >
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
                {renderPagination()}
            </div>
        </>
    )
}
const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}