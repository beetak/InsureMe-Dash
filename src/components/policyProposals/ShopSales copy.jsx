import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, fetchAsyncCategory, getCategories } from '../../store/category-store';
import { ScaleLoader } from 'react-spinners';
import CategoryModal from '../category/CategoryModal';
import CategoryViewModal from '../category/CategoryViewModal';

export default function ShopSales() {

    const [catResponse, setCatResponse] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
  
    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const dispatch = useDispatch()
    
    const categories = useSelector(getCategories)

    const fetchCategoryData = () => {
        setLoading(true)
        setMessage("Processing...")
        dispatch(fetchAsyncCategory())
        .then((res)=>{
        console.log("search response ", res)
        setLoading(false)
        if(!res.payload.success){
            setCatResponse("Error fetching resource, Please check your network connection")
        }
        else if(res.payload.success&&!res.payload.data){
            setCatResponse("No Categories found")
        }
        })
        .finally(()=>{
        setLoading(false)
        setMessage("")
        })
    }

    useEffect(()=>{
        fetchCategoryData()
    },[dispatch])

    useEffect(() => {
        
    }, [categories]);

    const handleDelete = (id) => {
        setLoading(true)
        setMessage("Deleting...")
        dispatch(deleteCategory({
            id
        }))
        .then((response)=>{
            if(response.payload&&response.payload.success){
            setMessage("Deleted")
            }
            else{
                setLoading(true)
            }            
        })
        .finally(()=>{
        dispatch(fetchCategoryData())
        .then(()=>{
            setLoading(false)
        })
        })
    }
        
    const renderTableHeader = () => {
        const columns = [
          { key: 'item', label: '#', width: "1" },
          { key: 'policy', label: 'Policy Name' },
          { key: 'qty', label: 'Quantity' },
          {
            key: 'revenue',
            label: 'Revenue Collections',
            subHeaders: [
              { key: 'usd', label: 'USD' },
              { key: 'zig', label: 'ZIG' },
            ],
          },
        ];
      
        return columns.map((column) => (
          <th
            key={column.key}
            className={`text-sm font-bold tracking-wide text-left ${column.width ? "p-3 w-" + column.width : "py-3"} ${column.key === 'revenue' && "text-center"} ${column.key === 'action' && "text-center"}`}
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

    const renderTableRows = () => {
        return categories?categories.map((item, index) => (
        <tr key={index} className={`${index%2!==0&&" bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
            <td className='font-bold text-blue-5 justify-center items-center w-7'><div className='w-full justify-center flex items-center'>{++index}</div></td>
            <td>{item.categoryName}</td>
            <td>{formatDate(item.createdAt)}</td>
            <div className="flex w-full justify-around">
                <td>$200.40</td>
                <td>$7450.50</td>
            </div>
        </tr>
        )):
        <tr className=''>
        <td colSpan={7} style={{ textAlign: 'center' }}>{catResponse}</td>
        </tr>
    };

    const getModal =(isOpen)=>{
        setIsOpen(isOpen)
        // isOpen&&fetchCategoryData()
    }
    const getViewModal =(isOpen)=>{
        setViewOpen(isOpen)
    }

    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                {
                    isOpen&& <CategoryModal setModal={getModal} data={modalData}/>
                }
                {
                    viewOpen&& <CategoryViewModal setModal={getViewModal} data={modalData}/>
                }
                <h2 className="text-lg font-semibold">National Sales Report</h2>
                <div className='flex justify-between py-4'>
                    <div className="xl:col-span-3 flex-col items-center space-y-2">
                        <div className="border flex rounded-full border-gray-400 outline-0 p-1 px-2">
                            <h6 className='mr-3'>Start Date:</h6>
                            <DatePicker
                                showPopperArrow
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                maxDate={new Date()}
                                className='w-[105px] outline-none rounded-3xl bg-gray-200 px-3'
                            />
                        </div>
                        <div className="border flex rounded-full border-gray-400 outline-0 p-1 px-2">
                            <h6 className='mr-3'>End Date:</h6>
                            <DatePicker
                                showPopperArrow
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                maxDate={new Date()}
                                className='w-[105px] outline-none rounded-3xl bg-gray-200 px-3'
                            />
                        </div>
                        <div className="border flex rounded-full border-gray-400 outline-0 p-1 px-2">
                            <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className=" bg-inherit rounded-xs"
                            >
                                <option value="5" onClick={()=>setIsOpen(true)}>Transaction Status</option>
                                <option value="5" onClick={()=>setIsOpen(true)}>Successful Transactions</option>
                                <option value="5" onClick={()=>setIsOpen(true)}>Failed Transactions</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className='w-full justify-center flex space-x-2 items-center'>
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
                            <div className='md:flex-col md:justify-center'>
                                <button
                                    onClick={
                                        ()=>{
                                        setModalData(item)
                                        setIsOpen(true)
                                        }
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
