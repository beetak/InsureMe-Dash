import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, fetchAsyncCategory, getCategories } from '../../store/category-store';
import { ScaleLoader } from 'react-spinners';
import CategoryModal from '../category/CategoryModal';
import CategoryViewModal from '../category/CategoryViewModal';
import { fetchSalesByDateRange } from '../../store/payments-store';
import jsPDF from 'jspdf'
import "jspdf-autotable";
import commissions from './commissions.json'
import InsuranceApi, { setupInterceptors } from '../api/InsuranceApi';
import useAuth from '../../hooks/useAuth';
const img = "images/icon.png"
const telone = "images/telone-logo.png"

export default function NationalSales() {

    const { user, setUser } = useAuth()

    const [catResponse, setCatResponse] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [sales, setSales] = useState("")

    const dispatch = useDispatch()

    const handleSearch = async() => {
        setLoading(true)
        setMessage("Processing...")
        const formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
        const formattedEndDate = new Date(endDate).toISOString().slice(0, 10);
        try{
            const response = await InsuranceApi.get(`/product-payments/by-date?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
            console.log("post results: ", response)
            if(response.data.code==="OK"&&response.data.data.length>0){
                setSales(response.data.data)
                setLoading(true)
            }
            else{
                setLoading(false)
                setMessage("")
            }
        }
        catch(err){
            setLoading(false)
        }
    }
    
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
        setupInterceptors(()=> user, setUser)
        fetchCategoryData()
    },[dispatch])
        
    const renderTableHeader = () => {
        const columns = [
          { key: 'item', label: '#', width: "1" },
          { key: 'policy', label: 'Policy Name' },
          { key: 'category', label: 'Category' },
          {
            key: 'revenue',
            label: 'Revenue Collections',
            subHeaders: [
              { key: 'usd', label: 'USD' },
              { key: 'zwg', label: 'ZWG' },
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
        return sales?sales.map((item, index) => (
        <tr key={index} className={`${index%2!==0&&" bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
            <td className='font-bold text-blue-5 justify-center items-center w-7'><div className='w-full justify-center flex items-center'>{++index}</div></td>
            <td>{item.policyName}</td>
            <td>{item.categoryName}</td>
            {/* <td>{formatDate(item.createdAt)}</td> */}
            <div className="flex w-full justify-around">
                <td>
                    {/* {item.totalUsdAmount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    })} */}
                    500
                </td>
                <td>
                    {/* {item.totalZigAmount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    })} */}
                    2000
                </td>
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

    const printDocument = () => {
        let invoiceData = [
            ["First Mutual Insurance", "Life Insurance", 1000, 50, 75, 1000, 50, 75],
            ["Sanctuary Insurance", "Travel Insurance", 2000, 100, 150, 2000, 100, 150],
            ["Old Mutual Insurance", "Third Party", 3000, 150, 225, 3000, 150, 225]
        ];
    
        const headers = [
                ["Policy", "Quantity", "Revenue Collections",""],
                ["", "", "USD","ZIG"]
        ];
    
        let invoiceContent = {
            startY: 150, // Adjust the spacing as needed
            head: headers,
            headStyles: {
                fillColor: [31, 41, 55], // Set the fill color of the header cells to white
                textColor: [255, 255, 255], // Set the text color of the header cells to white
                halign: 'start', // Center the text in the header cells
                fontStyle: 'bold',
                fontSize: 7,
                cellPadding: 3, // Increase the cell padding for better appearance
                lineWidth: 0.5, // Add a border to the header cells
                lineHeight: 0.5, // Add a border to the header cells
                lineColor: [31, 41, 55], // Set the border color of the header cells
                borderRadius: 5 // Add rounded corners to the header cells
            },
            margin: { left: 45, right: 35 },
            body: commissions.flatMap(broker => [
                ...broker.policyDetails.map(policy => [
                    policy.policyName,
                    10,
                    policy.totalAmountUsd,
                    policy.totalAmountZig
                ])
            ]),
            bodyStyles: {
                fillColor: [255, 255, 255], // Set the fill color of the body cells to white
                textColor: [0, 0, 0], // Set the text color of the body cells to black
                fontSize: 7,
                halign: 'left', // Center the text in the body cells
                cellPadding: 3 // Increase the cell padding for better appearance
            },
            columnStyles: {
                0: { cellWidth: 230 }, // Width for the first column (empty column)
                1: { cellWidth: 35 }, // Width for the "Description" column
                2: { cellWidth: 50, align: 'right', colSpan: 2 }, // Width for the "Quantity" column
                3: { cellWidth: 50, align: 'right' }, // Width for the "Unit Price" column
            },
            theme: 'grid', // Use the 'grid' theme for the table
            styles: {
                tableWidth: 'auto', // Set the table width to 'auto'
                overflow: 'linebreak', // Wrap the text in the cells
                cellPadding: 4, // Increase the cell padding
                fontSize: 9, // Set the font size for the table
                lineWidth: 0.5, // Set the line width for the table borders
                lineColor: [220, 220, 220] // Set the line color for the table borders
            }
        };

        const contentHeight = invoiceContent.head.length * 10 + invoiceContent.body.length * 15;

        const current = new Date();
        var today = new Date(),
            curTime = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

        const dateString = new Date(current);
        const formattedDate = dateString.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

        var doc = new jsPDF('potrait', 'px', 'a4', 'false')

        const pageHeight = doc.internal.pageSize.height;
        const footerY = pageHeight - 40; // Adjust the spacing as needed
        const pageWidth = doc.internal.pageSize.width;
        const text = "107 Kwame Nkrumah Avenue, Harare, Zimbabwe\nP.O Box CY 331, Causeway, Harare, Zimbabwe\n24 Hour Call Center - +263 0242 700950"
        const textWidth = doc.getTextWidth(text);
        const centerX = (pageWidth - textWidth) / 2;
        const textX = centerX - (textWidth / -2); // Adjust the horizontal position to align in the center

        doc.addImage(telone, 'PNG', 45, 40, 72, 28)
        doc.addImage(img, 'PNG', 340, 40, 72, 28)
        doc.setFont('Times New Roman', 'bold')
        doc.setFontSize(16)
        doc.setTextColor(15, 145, 209); // set text color to #3675D4
        doc.text(410, 95, 'National Sales Report', { align: 'right' })

        doc.setLineWidth(0.5); // Set the width of the line
        doc.line(45, 110, 410, 110); // Draw the line from (340, 100) to (570, 100)

        doc.setFont('Times New Roman', 'bold');
        doc.setFontSize(12);
        doc.text(410, 125, 'Invoice To', { align: 'right' });

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
        doc.line(45, footerY - 10, 410, footerY - 10); // Draw the line from (340, 100) to (570, 100)

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
                <h2 className="text-lg font-semibold">National Sales Report</h2>
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
                                        id="systemAdOns"
                                        name="systemAdOns"
                                        className=" bg-inherit rounded-xs cursor-pointer"
                                    >
                                        <option value="5" onClick={()=>setIsOpen(true)}>Transaction Status</option>
                                        <option value="5" onClick={()=>setIsOpen(true)}>Successful</option>
                                        <option value="5" onClick={()=>setIsOpen(true)}>Failed</option>
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
