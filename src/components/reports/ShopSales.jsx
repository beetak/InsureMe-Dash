import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import CategoryModal from '../category/CategoryModal';
import CategoryViewModal from '../category/CategoryViewModal';
import { fetchAsyncRegions, fetchShopsByTownId, fetchTownsByRegionId, getRegions, getShops, getTowns } from '../../store/entity-store';
import { fetchUserByShopId, getUsers } from '../../store/user-store';
import { fetchAsyncCategory, getCategories } from '../../store/category-store';
import { getInsurers } from '../../store/insurer-store';
import { fetchSalesByDateRange } from '../../store/payments-store';
import useAuth from '../../hooks/useAuth';
import { setupInterceptors } from '../api/InsuranceApi';

export default function ShopSales() {

    const [catResponse, setCatResponse] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [regions, setRegions] = useState("");
    const [regionId, setRegionId] = useState("");
    const [towns, setTowns] = useState("");
    const [townId, setTownId] = useState("");
    const [shops, setShops] = useState("");
    const [shopId, setShopId] = useState("");
    const [sales, setSales] = useState("")

    const { user, setUser } = useAuth()

    const [regionResponse, setRegionResponse] = useState('')
    const [townResponse, setTownResponse] = useState('')
    const [shopResponse, setShopResponse] = useState('')

    useEffect(()=>{
        setupInterceptors(() => user, setUser)
        fetchRegions()
    },[user, setUser])

    const fetchRegions = async () => {
        setLoading(true)
        try{
            const response = await InsuranceApi.get('/region')
            if(response.data.code==="OK"&&response.data.data.length>0){
                setRegions(response.data.data)
            }
            else if (response.data.code==="OK"&&response.data.data.length<1){
                setRegionResponse("No Regions found")
            }
        }
        catch(err){
            if(err){
                setRegionResponse("Error fetching resource, Please check your network connection")
            }
            else if(err){
                setRegionResponse("No Regions found")
            }
        }
        finally{
            setLoading(false)
        }
    }

    const fetchTowns = async (id) => {
        try{
            const response = await InsuranceApi.get(`/town/region/${id}`)
            if(response.data.code==="OK"&&response.data.data.length>0){
                setTowns(response.data.data)
            }
            else if (response.data.code==="OK"&&response.data.data.length<1){
                setTownResponse("No towns found for this region")
            }
        }
        catch(err){
            setTownResponse("Error fetching towns")
        }
        
    }
    
    const fetchShops = async (id) => {
        try{
            const response = await InsuranceApi.get(`/shop/town/${id}`)
            if(response.data.code==="OK"&&response.data.data.length>0){
                setShops(response.data.data)
            }
            else if (response.data.code==="NOT_FOUND"){
                setShopResponse("No shops found for this town")
            }
        }
        catch(err){
            setShopResponse("Error fetching towns")
        }
    }

    const dispatch = useDispatch()
    
    const categories = useSelector(getCategories)

    const handleSearch = () => {
        setLoading(true)
        setMessage("Processing...")
        const formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
        const formattedEndDate = new Date(endDate).toISOString().slice(0, 10);
        dispatch(fetchSalesByDateRange({
            startDate: formattedStartDate,
            endDate: formattedEndDate
        }))
        .then((response)=>{
            if(response.payload&&response.payload.success){
                console.log("search result ", response.payload.data)
                setMessage("")
                setSales(response.payload.data.data)
            }
            else{
                setLoading(true)
            }            
        })
        .finally(()=>{
            setLoading(false)
            setMessage("")
        })
    }

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

    const fetchAgents = (id) => {
        // setLoading(true)
        // setMessage("Processing...")
        dispatch(fetchUserByShopId(id))
        .then((res)=>{
            console.log("search response ", res)
            // setLoading(false)
            if(!res.payload.success){
                setCatResponse("Error fetching resource, Please check your network connection")
            }
            else if(res.payload.success&&!res.payload.data){
                setCatResponse("No Categories found")
            }
        })
        .finally(()=>{
            // setLoading(false)
            // setMessage("")
        })
    }

    useEffect(()=>{
        fetchCategoryData()
        dispatch(fetchAsyncRegions())
        .then((res)=>{
            if(res.payload.success){
                console.log("found", res.payload.data)
                setRegions(res.payload.data)
            }
        })
    },[dispatch])
        
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
              { key: 'ZWG', label: 'ZWG' },
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
                <h2 className="text-lg font-semibold">Shop Sales Report</h2>
                <div className='flex-col py-4 space-y-2'>
                    <div className="grid grid-cols-3 items-center justify-between rounded-full border border-gray-400 gap-2">
                        <div className="flex rounded-full p-1 px-2 border-r border-gray-400 shadow-[0_0_10px_0_rgba(0,0,0,0.8)">
                            <select
                                id="regionId"
                                name="regionId"
                                value={regionId}
                                onChange={(e) => {setRegionId(Number(e.target.value));fetchTowns(e.target.value)}}
                                className=" bg-inherit rounded-xs cursor-pointer min-w-48"
                            >
                                <option value={0}>Select Parent Region</option>
                                {regions ? (
                                    regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.name}
                                    </option>
                                    ))
                                ) : (
                                    <option value={0} className='text-red-500'>{regionResponse}</option>
                                )}
                            </select>
                        </div>
                        <div className="flex rounded-full p-1 px-2 border-r border-gray-400">
                            <select
                                id="townId"
                                name="townId"
                                value={townId}
                                onChange={(e) => {setTownId(Number(e.target.value));fetchShops(e.target.value)}}
                                className=" bg-inherit rounded-xs cursor-pointer"
                            >
                                <option value={0}>Select User Town</option>
                                {towns ? (
                                    towns.map((town) => (
                                    <option key={town.id} value={town.id}>
                                        {town.name}
                                    </option>
                                    ))
                                ) : (
                                    <option value={0}>{townResponse}</option>
                                )}
                            </select>
                        </div>
                        <div className="flex rounded-full p-1 px-2 border-r border-gray-400">
                            <select
                                id="shopId"
                                name="shopId"
                                value={shopId}
                                onChange={(e) => {setShopId(Number(e.target.value));fetchAgents(e.target.value)}}
                                className=" bg-inherit rounded-xs cursor-pointer"
                            >
                                <option value={0}>Select User Shop</option>
                                {shops ? (
                                    shops.map((shop) => (
                                    <option key={shop.id} value={shop.id}>
                                        {shop.name}
                                    </option>
                                    ))
                                ) : (
                                    <option value={0}>{shopResponse}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 items-center justify-between rounded-full border border-gray-400 gap-2">
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
                        <div className="flex p-1 px-2">
                            <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className=" bg-inherit rounded-xs cursor-pointer"
                            >
                                <option value="5" onClick={()=>setIsOpen(true)}>Transaction Status</option>
                                <option value="5" onClick={()=>setIsOpen(true)}>Successful Transactions</option>
                                <option value="5" onClick={()=>setIsOpen(true)}>Failed Transactions</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <div className='flex items-center rounded-full border overflow-hidden border-gray-400 text-xs'>
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
                {
                    loading ? 
                    (
                        loadingAnimation()
                    ) : (
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
                                </div>:
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
