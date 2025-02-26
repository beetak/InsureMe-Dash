import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import CategoryModal from '../category/CategoryModal';
import CategoryViewModal from '../category/CategoryViewModal';
import { fetchSalesByDate } from '../../store/payments-store';
import useAuth from '../../hooks/useAuth';
import InsuranceApi, { setupInterceptors } from '../api/InsuranceApi';

export default function DailySales() {

    const { user, setUser } = useAuth()

    useEffect(()=>{
        setupInterceptors(()=> user, setUser)
    },[])

    const [message, setMessage] = useState('Enter report date and click search')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [transactionDate, setTransactionDate] = useState(new Date());
    const [sales, setSales] = useState("")

    const handleSearch = async() => {
        setLoading(true)
        setSales("")
        setMessage("Loading, Please wait a moment");
        const formattedStartDate = new Date(transactionDate).toISOString().slice(0, 10);
        const formattedEndDate = new Date(transactionDate).toISOString().slice(0, 10);
        try{
            const response = await InsuranceApi.get(`/product-payments/by-date?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
            
            if(response.data.code==="OK"){
                setMessage(response.data.message);
                setSales(response.data)
                setLoading(false)
            }
            else if(response.data.code==="NOT_FOUND"){
                setLoading(false)
                setMessage("No sales record found")
            }
            else{
                setLoading(false)
                setMessage("Error Fetching Resource")
            }
        }
        catch(err){
            setLoading(false)
            setMessage(err.response.data.message)
        }
        finally{
            setLoading(false)
        }
    }
        
    const renderTableHeader = () => {
        const columns = [
          { key: "item", label: "#", width: "1" },
          { key: "broker", label: "Broker Name" },
          {
            key: "revenue",
            label: "Revenue Collections",
            subHeaders: [
              { key: "usd", label: "USD" },
              { key: "zwg", label: "ZWG" },
            ],
          },
          {
            key: "tax",
            label: "Tax Collections",
            subHeaders: [
              { key: "usd_tax", label: "USD Tax" },
              { key: "zwg_tax", label: "ZWG Tax" },
            ],
          },
        ]
    
        return columns.map((column) => (
          <th
            key={column.key}
            className={`text-sm font-bold tracking-wide text-left ${column.width ? "p-3 w-" + column.width : "py-3"} ${(column.key === "revenue" || column.key === "tax") && "text-center"}`}
          >
            <span className="mr-2">{column.label}</span>
            {column.subHeaders && (
              <div className="flex w-full justify-around">
                {column.subHeaders.map((subHeader) => (
                  <span key={subHeader.key} className="text-xs font-semibold">
                    {subHeader.label}
                  </span>
                ))}
              </div>
            )}
          </th>
        ))
    }

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
        if (!sales || !sales.data || !sales.data.TRAVEL) {
          return (
            <tr>
              <td colSpan={5} className="text-center py-4">
                {message || "No data available"}
              </td>
            </tr>
          )
        }
    
        return Object.entries(sales.data).map(([policyName, policyData], index) => (
            <tr key={policyName} className={`p-3 text-sm text-gray-600 font-semibold ${index % 2 === 1 ? "bg-gray-50" : ""}`}>
                <td className="font-bold text-blue-5 justify-center items-center w-7">
                    <div className="w-full justify-center flex items-center">{index + 1}</div>
                </td>
                <td>{policyName}</td>
                <td>
                  <div className="flex w-full justify-around">
                    <div>{policyData.USD ? policyData.USD.toFixed(2) : "0.00"}</div>
                    <div>{policyData.ZWG ? policyData.ZWG.toFixed(2) : "0.00"}</div>
                  </div>
                </td>
                <td>
                  <div className="flex w-full justify-around">
                    <div>{policyData.USD_TAX ? policyData.USD_TAX.toFixed(2) : "0.00"}</div>
                    <div>{policyData.ZWG_TAX ? policyData.ZWG_TAX.toFixed(2) : "0.00"}</div>
                  </div>
                </td>
            </tr>
        ))
    }

    const getModal =(isOpen)=>{
        setIsOpen(isOpen)
        // isOpen&&fetchCategoryData()
    }
    const getViewModal =(isOpen)=>{
        setViewOpen(isOpen)
    }

    console.log("  sales", sales)

    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                {
                    isOpen&& <CategoryModal setModal={getModal} data={modalData}/>
                }
                {
                    viewOpen&& <CategoryViewModal setModal={getViewModal} data={modalData}/>
                }
                <h2 className="text-lg font-semibold">Daily Sales Report</h2>
                <div className='flex justify-between py-4'>
                    <div className='flex items-center rounded-full border overflow-hidden border-gray-500 text-xs'>
                        <label htmlFor="last-name" className="w-16 font-medium leading-6 px-2 py-1 bg-gray-500 justify-center flex text-white">
                            Show
                        </label>
                        <div className="">
                            <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className="bg-inherit px-3 py-1 cursor-pointer"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="All">All</option>
                            </select>
                        </div>
                        <label htmlFor="last-name" className="w-16 font-medium leading-6 px-2 py-1 bg-gray-500 justify-center flex text-white">
                            Entries
                        </label>                            
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className='w-full justify-center flex items-center'>
                            <div className="flex items-center justify-between rounded-full border border-gray-400 mr-1">
                                <div className="flex rounded-full p-1 border-r border-gray-400">
                                    <h6 className='mr-3'>Date:</h6>
                                    <DatePicker
                                        showPopperArrow
                                        selected={transactionDate}
                                        onChange={(date) => setTransactionDate(date)}
                                        maxDate={new Date()}
                                        className='w-[105px] outline-none rounded-3xl bg-gray-200 px-1 cursor-pointer'
                                    />
                                </div>
                                {/* <div className="flex p-1">
                                    <select
                                        id="systemAdOns"
                                        name="systemAdOns"
                                        className=" bg-inherit rounded-xs cursor-pointer"
                                    >
                                        <option value="5" onClick={()=>setIsOpen(true)}>Transaction Status</option>
                                        <option value="5" onClick={()=>setIsOpen(true)}>Successful</option>
                                        <option value="5" onClick={()=>setIsOpen(true)}>Failed</option>
                                    </select>
                                </div> */}
                            </div>
                            <div className='md:flex-col md:justify-center'>
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
                                        ()=>{
                                            setModalData(item)
                                            setIsOpen(true)
                                        }
                                    }
                                    className={`space-x-2 border-gray-300 rounded-r-full px-3 h-8 items-center bg-gray-500 text-gray-100 hover:bg-gray-600`}
                                >
                                    <i className='fas fa-print text-xs'/>
                                    <span className='text-xs'>Print</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {loading ? (
                    loadingAnimation()
                    ) : (
                    <>
                        {sales ? (
                        <div className="overflow-auto rounded:xl shadow-md">
                            <table className="w-full">
                            <thead className="bg-gray-100 border-b-2 border-gray-300">
                                <tr>{renderTableHeader()}</tr>
                            </thead>
                            <tbody>{loading ? loadingAnimation() : renderTableRows()}</tbody>
                            </table>
                        </div>
                        ) : (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="flex flex-col">
                            <div className=" bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
                                <div className="flex justify-center items-center bg-gray-700 text-white">
                                <span className="font-semibold">{message}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                        )}
                    </>
                )}          
            </div>
        </>
    )
}

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
}
