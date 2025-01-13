import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, fetchAsyncCategory, getCategories } from '../../store/category-store';
import { ScaleLoader } from 'react-spinners';
import CategoryModal from '../category/CategoryModal';
import CategoryViewModal from '../category/CategoryViewModal';
import { fetchAsyncRegions, fetchShopsByTownId, fetchTownsByRegionId, getRegions, getShops, getTowns } from '../../store/entity-store';
import { authActions, fetchUserByShopId, findUserLike, getUsers } from '../../store/user-store';
import { fetchAsyncInsurer, getInsurers } from '../../store/insurer-store';
import { fetchAsyncPolicy, getPolicies } from '../../store/policy-store';
import { fetchSalesByDateRange } from '../../store/payments-store';
import jsPDF from 'jspdf'
import "jspdf-autotable";
import commissions from './commissions.json'
const img = "images/icon.png"
const telone = "images/telone-logo.png"

export default function Commissions() {

    const [catResponse, setCatResponse] = useState('')
    const [insurerResponse, setInsurerResponse] = useState('')
    const [message, setMessage] = useState('')
    const [townState, setTownState] = useState(false)
    const [shopState, setShopState] = useState(false)
    const [searchActive, setSearchActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [sales, setSales] = useState("")

    const dispatch = useDispatch()
    
    const categories = useSelector(getCategories)
    const insurers = useSelector(getInsurers)

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

    const fetchInsurers = () => {
        dispatch(fetchAsyncInsurer())
        .then((res)=>{
            setLoading(false)
            if(!res.payload.success){
                setInsurerResponse("Error fetching resource, Please check your network connection")
            }
            else if(res.payload.success&&!res.payload.data){
                setInsurerResponse("No Insurers found")
            }
        })
        .finally(()=>{
            // setLoading(false)
        })
    }

    useEffect(()=>{
        fetchInsurers()
        dispatch(fetchAsyncRegions())
    },[dispatch])
        
    const renderTableHeader = () => {
        const columns = [
          { key: 'item', label: '#', width: "1" },
          { key: 'broker', label: 'Broker Name' },
          { key: 'policy', label: 'Policy' },
          {
            key: 'revenue',
            label: 'Revenue Collections',
            subHeaders: [
              { key: 'usd', label: 'USD' },
              { key: 'zig', label: 'ZIG' },
            ],
          },
          {
            key: 'commission',
            label: 'TelOne Commission 10%',
            subHeaders: [
              { key: 'usd', label: 'USD' },
              { key: 'zig', label: 'ZIG' },
            ],
          },
          {
            key: 'remmitance',
            label: 'Broker Remmitance',
            subHeaders: [
              { key: 'usd', label: 'USD' },
              { key: 'zig', label: 'ZIG' },
            ],
          },
        ];
      
        return columns.map((column) => (
          <th
            key={column.key}
            className={`text-sm font-bold tracking-wide text-left ${column.width ? "p-3 w-" + column.width : "py-3"} ${(column.key === 'revenue' || column.key === 'commission' || column.key === 'remmitance') && "text-center"} ${column.key === 'action' && "text-center"}`}
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

    const renderTableRows = () => {
        return categories?categories.map((item, index) => (
        <tr key={index} className={`${index%2!==0&&" bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
            <td className='font-bold text-blue-5 justify-center align-top w-7'><div className='w-full justify-center flex items-center'>{++index}</div></td>
            <td className='justify-start align-top'>Sanctuary Insurance</td>
            <td className='align-top'>
                <div className="flex-col flex justify-around">
                    <td>Third Party</td>
                    <td>Full Cover</td>
                </div>
            </td>
            <td className='align-top'>
                <div className="flex justify-around">
                    <td>$200.40</td>
                    <td>$7450.50</td>
                </div>
                <div className="flex justify-around">
                    <td>$400.00</td>
                    <td>$5000.00</td>
                </div>
            </td>
            <td className='align-top'>
                <div className="flex justify-around">
                    <td>$20.04</td>
                    <td>$745.05</td>
                </div>
                <div className="flex justify-around">
                    <td>$40.00</td>
                    <td>$500.00</td>
                </div>
            </td>
            <td className='align-top'>
                <div className="flex justify-around">
                    <td>$180.36</td>
                    <td>$6705.45</td>
                </div>
                <div className="flex justify-around">
                    <td>$360.00</td>
                    <td>$4500.00</td>
                </div>
            </td>
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

    function DateRangeDisplay({ startDate, endDate }) {
        const formatDate = (date) => {
            return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        };
        if (startDate.getTime() === endDate.getTime()) {
            return formatDate(startDate);
        } else {
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        }
      
        // return (
        //   <div>
        //     <h2>Date Range:</h2>
        //     <p>{displayDateRange()}</p>
        //   </div>
        // );
    }

    const printDocument = () => {        
        const headers = [
                ["Broker", "Policy", "Revenue Collections","", "TelOne Commission","", "Broker Remmitance",""],
                ["", "", "USD","ZIG", "USD","ZIG", "USD","ZIG"]
        ];
    
        let invoiceContent = {
            startY: 150, // Adjust the spacing as needed
            head: headers,
            headStyles: {
                fillColor: [31, 41, 55], // Set the fill color of the header cells to white
                textColor: [255, 255, 255], // Set the text color of the header cells to white
                halign: 'start', // Center the text in the header cells
                fontStyle: 'bold',
                fontSize: 11,
                cellPadding: 3, // Increase the cell padding for better appearance
                lineWidth: 0.5, // Add a border to the header cells
                lineHeight: 0.5, // Add a border to the header cells
                lineColor: [31, 41, 55], // Set the border color of the header cells
                borderRadius: 5 // Add rounded corners to the header cells
            },
            margin: { left: 45, right: 35 },
            body: commissions.flatMap(broker => [
                [broker.brokerName], // Add the brokerName as a separate row
                ...broker.policyDetails.map(policy => [
                    '', // Leave the first column empty for the policy details
                    policy.policyName,
                    policy.totalAmountUsd,
                    policy.totalAmountZig,
                    policy.telOneCommissionUsd,
                    policy.telOneCommissionZig,
                    policy.brokerRemmitanceUsd,
                    policy.brokerRemmitanceZig
                ])
            ]),
            bodyStyles: {
                fillColor: [255, 255, 255], // Set the fill color of the body cells to white
                textColor: [0, 0, 0], // Set the text color of the body cells to black
                fontSize: 11,
                halign: 'left', // Center the text in the body cells
                cellPadding: 3 // Increase the cell padding for better appearance
            },
            columnStyles: {
                0: { cellWidth: 95 }, // Width for the first column (empty column)
                1: { cellWidth: 120 }, // Width for the "Description" column
                2: { cellWidth: 55, align: 'right', colSpan: 2 }, // Width for the "Quantity" column
                3: { cellWidth: 55, align: 'right' }, // Width for the "Unit Price" column
                4: { cellWidth: 55, align: 'right' }, // Width for the "Unit Price" column
                5: { cellWidth: 55, align: 'right' }, // Width for the "Remmitance" column
                6: { cellWidth: 55, align: 'right' }, // Width for the "Remmitance" column
                7: { cellWidth: 55, align: 'right' }, // Width for the "Broker Remmitance" column
            },
            theme: 'grid', // Use the 'grid' theme for the table
            styles: {
                tableWidth: 'auto', // Set the table width to 'auto'
                overflow: 'linebreak', // Wrap the text in the cells
                cellPadding: 4, // Increase the cell padding
                fontSize: 11, // Set the font size for the table
                lineWidth: 0, // Set the line width for the table borders
                lineColor: [220, 220, 220] // Set the line color for the table borders
            }
        };
    
        const contentHeight = invoiceContent.head.length * 10 + invoiceContent.body.length * 15;
    
        const current = new Date();
        var today = new Date(),
            curTime = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    
        const dateString = new Date(current);
        const formattedDate = dateString.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    
        var doc = new jsPDF('landscape', 'px', 'a4', 'false')
    
        const pageHeight = doc.internal.pageSize.height;
        const footerY = pageHeight - 40; // Adjust the spacing as needed
        const pageWidth = doc.internal.pageSize.width;
        const text = "107 Kwame Nkrumah Avenue, Harare, Zimbabwe\nP.O Box CY 331, Causeway, Harare, Zimbabwe\n24 Hour Call Center - +263 0242 700950"
        const textWidth = doc.getTextWidth(text);
        const centerX = (pageWidth - textWidth) / 2;
        const textX = centerX - (textWidth / -2); // Adjust the horizontal position to align in the center
    
        doc.addImage(telone, 'PNG', 45, 40, 72, 28)
        doc.addImage(img, 'PNG', 520, 40, 72, 28)
        doc.setFont('Times New Roman', 'bold')
        doc.setFontSize(16)
        doc.setTextColor(15, 145, 209); // set text color to #3675D4
        doc.text(590, 95, 'Commission Report', { align: 'right' })
    
        doc.setLineWidth(0.5); // Set the width of the line
        doc.line(45, 110, 590, 110); // Draw the line from (340, 100) to (570, 100)
    
        doc.setFont('Times New Roman', 'bold');
        doc.setFontSize(12);
        doc.text(590, 125, 'Invoice To', { align: 'right' });
    
        doc.setFont('Times New Roman', 'regular');
        doc.setFontSize(9);
        // doc.text(410, 135, formatAddress("addressTo"), { align: 'right' });
    
        doc.setFont('Times New Roman', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 145, 209)
        doc.text(45, 125, formattedDate)
    
        doc.setFont('Times New Roman', 'medium')
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(9)
        // doc.text(45, 135, formatAddress("addressFrom"))
    
        doc.autoTable(invoiceContent);
    
        doc.setLineWidth(0.5); // Set the width of the line
        doc.line(45, footerY - 10, 590, footerY - 10); // Draw the line from (340, 100) to (570, 100)
    
        doc.setFontSize(9);
        doc.setTextColor(112, 112, 112);
        doc.setFont('Times New Roman', 'regular');
        doc.text(textX, footerY, text, { align: "center" });
    
        doc.save('insureme.pdf')
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
                <h2 className="text-lg font-semibold">Commissions Report</h2>
                <div className='flex justify-between py-4'>
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
                    <div className="flex items-center space-x-2">
                        <div className='w-full justify-center flex items-center'>
                            <div className="flex items-center justify-between rounded-full border border-gray-400 mr-1">
                                <div className="flex rounded-full p-1 border-r border-gray-400">
                                    <h6 className='mr-3'>Start Date:</h6>
                                    <DatePicker
                                        showPopperArrow
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        maxDate={new Date()}
                                        className='w-[105px] outline-none rounded-3xl bg-gray-200 px-1 cursor-pointer'
                                    />
                                </div>
                                <div className="flex rounded-full p-1 border-r border-gray-400">
                                    <h6 className='mr-3'>End Date:</h6>
                                    <DatePicker
                                        showPopperArrow
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        maxDate={new Date()}
                                        className='w-[105px] outline-none rounded-3xl bg-gray-200 px-1 cursor-pointer'
                                    />
                                </div>
                                <div className="flex p-1">
                                    <select
                                        id="insurer"
                                        name="insurer"
                                        className=" bg-inherit rounded-xs cursor-pointer"
                                    >
                                        <option value="" onClick={()=>setIsOpen(true)}>Select Insurer</option>
                                        <option value="">All Insurers</option>
                                        {
                                            insurers?insurers.map((insurer, index)=>(
                                                <option key={index} value="" onClick={()=>setIsOpen(true)}>{insurer.insurerName}</option>
                                            )):<option value="5" onClick={()=>setIsOpen(true)}>{insurerResponse}</option>
                                        }
                                    </select>
                                </div>
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
