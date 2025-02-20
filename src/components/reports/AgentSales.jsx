import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ScaleLoader } from 'react-spinners';
import jsPDF from 'jspdf'
import "jspdf-autotable";
import InsuranceApi, { setupInterceptors } from '../api/InsuranceApi';
import useAuth from '../../hooks/useAuth';
const img = "images/icon.png"
const telone = "images/telone-logo.png"

export default function AgentSales() {

    const { user, setUser } = useAuth()

    useEffect(()=>{
        setupInterceptors(()=> user, setUser)
    },[])

    const [message, setMessage] = useState('Enter date range and click search')
    const [searchActive, setSearchActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [sales, setSales] = useState("")
    const [userResponse, setUserResponse] = useState("")
    const [inputValue, setInputValue] = useState("")
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState({ id: null, name: "" })

    const handleSearch = async() => {
        setLoading(true)
        console.log("searching sales for: ", selectedUser.id);
        if (!selectedUser.id && user.role!=="SALES_AGENT") {
            setMessage("Please select a user first");
            setLoading(false);
            return;
        }
        setMessage("Loading, Please wait a moment");
        const formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
        const formattedEndDate = new Date(endDate).toISOString().slice(0, 10);
        try{
            const response = await InsuranceApi.get(`/product-payments/by-sales-agent/${selectedUser.id||user.userId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
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

    const handleNameChange = async (e) => {
        const value = e.target.value
        setInputValue(value)
        setUsers([])
        if (value.length > 2) {
          try {
            const response = await InsuranceApi.get(`/users/search?startingWord=${value}`)
            if (response.data.code === "OK" && response.data.data.length > 0) {
              setUsers(response.data.data)
              setSearchActive(true)
            } else {
              setUserResponse("Not Found")
            }
          } catch (error) {
            console.error("Error fetching users:", error)
            setUserResponse("Error fetching users")
          }
        } else {
          setSearchActive(false)
        }
      }
    
      const handleUserSelect = (user) => {
        setSelectedUser({ id: user.id, name: `${user.firstname} ${user.lastname}` })
        setInputValue(`${user.firstname} ${user.lastname}`)
        setSearchActive(false)
      }

    const printDocument = () => {
        const headers = [
          ["#", "Policy Name", "Revenue Collections", ""],
          ["", "", "ZWG", "USD"],
        ]
    
        // Calculate totals
        const totals = sales.reduce(
          (acc, item) => {
            acc.ZWG += Number.parseFloat(item.amounts.ZWG) || 0
            acc.USD += Number.parseFloat(item.amounts.USD) || 0
            return acc
          },
          { ZWG: 0, USD: 0 },
        )
    
        const invoiceContent = {
          startY: 170,
          head: headers,
          headStyles: {
            fillColor: [31, 41, 55],
            textColor: [255, 255, 255],
            halign: "start",
            fontStyle: "bold",
            fontSize: 7,
            cellPadding: 3,
            lineWidth: 0.5,
            lineHeight: 0.5,
            lineColor: [31, 41, 55],
            borderRadius: 5,
          },
          margin: { left: 45, right: 35 },
          body: [
            ...sales.map((item, index) => [
              index + 1,
              item.insuranceCategory,
              item.amounts.ZWG || "",
              item.amounts.USD || "",
            ]),
            // Add totals row
            ["", "Total", totals.ZWG.toFixed(2), totals.USD.toFixed(2)],
          ],
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontSize: 7,
            halign: "left",
            cellPadding: 3,
          },
          columnStyles: {
            0: { cellWidth: 20, halign: "center" },
            1: { cellWidth: 245 },
            2: { cellWidth: 50, halign: "right" },
            3: { cellWidth: 50, halign: "right" },
          },
          theme: "grid",
          styles: {
            tableWidth: "auto",
            overflow: "linebreak",
            cellPadding: 4,
            fontSize: 9,
            lineWidth: 0.5,
            lineColor: [220, 220, 220],
          },
          didDrawCell: (data) => {
            // Style the totals row
            if (data.section === "body" && data.row.index === sales.length) {
              doc.setFont("Times New Roman", "bold")
              doc.setFillColor(240, 240, 240)
            }
          },
        }
    
        const current = new Date()
        const formattedDate = current.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    
        var doc = new jsPDF("portrait", "px", "a4", "false")
    
        const pageHeight = doc.internal.pageSize.height
        const footerY = pageHeight - 40
        const pageWidth = doc.internal.pageSize.width
        const text =
          "107 Kwame Nkrumah Avenue, Harare, Zimbabwe\nP.O Box CY 331, Causeway, Harare, Zimbabwe\n24 Hour Call Center - +263 0242 700950"
        const textWidth = doc.getTextWidth(text)
        const centerX = (pageWidth - textWidth) / 2
        const textX = centerX - textWidth / -2
    
        doc.addImage(telone, "PNG", 45, 40, 72, 28)
        doc.addImage(img, "PNG", 340, 40, 72, 28)
        doc.setFont("Times New Roman", "bold")
        doc.setFontSize(16)
        doc.setTextColor(15, 145, 209)
        doc.text(410, 95, "Agent Sales Report", { align: "right" })
    
        doc.setLineWidth(0.5)
        doc.line(45, 110, 410, 110)
    
        doc.setFont("Times New Roman", "bold")
        doc.setFontSize(12)
        doc.setTextColor(15, 145, 209)
        doc.text(45, 125, formattedDate)
    
        doc.setFont("Times New Roman", "medium")
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(9)
        doc.text(45, 140, `Agent: ${selectedUser?.name || user.name}`)
        doc.text(45, 155, `Date Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`)
    
        doc.autoTable(invoiceContent)
    
        doc.setLineWidth(0.5)
        doc.line(45, footerY - 10, 410, footerY - 10)
    
        doc.setFontSize(9)
        doc.setTextColor(112, 112, 112)
        doc.setFont("Times New Roman", "regular")
        doc.text(textX, footerY, text, { align: "center" })
    
        doc.save("agent_sales_report.pdf")
      }
    
    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                <h2 className="text-lg font-semibold">Agent Sales Report</h2>
                <div className='flex-col py-4 space-y-2'>
                    <div className={`${user.role==="SALES_AGENT"?" grid-cols-3 ":" grid-cols-4 "}grid items-center justify-between rounded-full border border-gray-400 gap-2`}>
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
                        {/* <div className={`${user.role==="SALES_AGENT"?"":" border-gray-400"}flex rounded-full p-1 px-2 border-r`}>
                            <select
                                id="transactionStatus"
                                name="transactionStatus"
                                className=" bg-inherit rounded-xs cursor-pointer"
                            >
                                <option value="5">Transaction Status</option>
                                <option value="5">Successful Transactions</option>
                                <option value="5">Failed Transactions</option>
                            </select>
                        </div> */}
                        <div className={`${user.role==="SALES_AGENT"?"hidden":""} flex p-1 px-2 relative`}>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="off"
                                placeholder="Name"
                                value={inputValue}
                                onChange={handleNameChange}
                                onFocus={() => setSearchActive(true)}
                                className="block w-full rounded-xs border-0 px-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-0 bg-gray-200 rounded-full outline-none sm:text-sm sm:leading-6"
                            />
                            {users.length > 0 && searchActive && (
                                <div className="absolute mt-7 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <ul className="py-2">
                                        {users.map((user) => (
                                            <li
                                                key={user.id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleUserSelect(user)}
                                            >
                                                {user.firstname} {user.lastname}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
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
                                                <span className="font-semibold">{message}</span>
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
