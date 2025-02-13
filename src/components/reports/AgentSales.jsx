import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ScaleLoader } from 'react-spinners';
import CategoryModal from '../category/CategoryModal';
import CategoryViewModal from '../category/CategoryViewModal';
import jsPDF from 'jspdf'
import "jspdf-autotable";
import commissions from './commissions.json'
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
    const [users, setUsers] = useState([])
    const [userResponse, setUserResponse] = useState("")
    const [selectedUser, setSelectedUser] = useState({ id: null, name: '' });

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

    const handleNameChange = async(e) => {
        setUsers([])
        if (e.target.value.length > 2) {
            const response = await InsuranceApi.get(`/users/search?startingWord=${e.target.value}`)
            console.log("post results: ", response)
            if(response.data.code==="OK"&&response.data.data.length>0){
                setUsers(response.data.data)
            }
            else{
                setUserResponse("Not Found")
            }
        }
    };

    const printDocument = () => {    
        const headers = [
                ["Broker", "Policy", "Revenue Collections","", "TelOne Commission","", "Broker Remmitance",""],
                ["", "", "USD","ZWG", "USD","ZWG", "USD","ZWG"]
        ];
    
        let invoiceContent = {
            startY: 170, // Adjust the spacing as needed
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
                [broker.brokerName], // Add the brokerName as a separate row
                ...broker.policyDetails.map(policy => [
                    '', // Leave the first column empty for the policy details
                    policy.policyName,
                    policy.totalAmountUsd,
                    policy.totalAmountZWG,
                    policy.telOneCommissionUsd,
                    policy.telOneCommissionZWG,
                    policy.brokerRemmitanceUsd,
                    policy.brokerRemmitanceZWG
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
                0: { cellWidth: 80 }, // Width for the first column (empty column)
                1: { cellWidth: 75 }, // Width for the "Description" column
                2: { cellWidth: 35, align: 'right', colSpan: 2 }, // Width for the "Quantity" column
                3: { cellWidth: 35, align: 'right' }, // Width for the "Unit Price" column
                4: { cellWidth: 35, align: 'right' }, // Width for the "Unit Price" column
                5: { cellWidth: 35, align: 'right' }, // Width for the "Remmitance" column
                6: { cellWidth: 35, align: 'right' }, // Width for the "Remmitance" column
                7: { cellWidth: 35, align: 'right' }, // Width for the "Broker Remmitance" column
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
        doc.text(410, 95, 'Commission Report', { align: 'right' })

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
                        <div className={`${user.role==="SALES_AGENT"?"":" border-gray-400"}flex rounded-full p-1 px-2 border-r`}>
                            <select
                                id="transactionStatus"
                                name="transactionStatus"
                                className=" bg-inherit rounded-xs cursor-pointer"
                            >
                                <option value="5">Transaction Status</option>
                                <option value="5">Successful Transactions</option>
                                <option value="5">Failed Transactions</option>
                            </select>
                        </div>
                        <div className={`${user.role==="SALES_AGENT"?"hidden":""} flex p-1 px-2 relative`}>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="family-name"
                                placeholder='Name'
                                onFocus={()=>setSearchActive(true)}
                                onChange={handleNameChange}
                                className="block w-full rounded-xs border-0 px-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-0 bg-gray-200 rounded-full outline-none sm:text-sm sm:leading-6"
                            />
                            {users && users.length>0 && searchActive && (
                                <div className="absolute mt-7 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <ul className="py-2">
                                        {users.map((user) => (
                                            <li
                                                key={user.id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedUser({ id: user.id, name: `${user.firstname} ${user.lastname}` });
                                                    setSearchActive(false);
                                                }}
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
