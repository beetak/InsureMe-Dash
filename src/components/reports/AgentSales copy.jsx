import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ScaleLoader } from 'react-spinners'
import jsPDF from 'jspdf'
import "jspdf-autotable"
import commissions from './commissions.json'
import InsuranceApi, { setupInterceptors } from '../api/InsuranceApi'
import useAuth from '../../hooks/useAuth'

const img = "images/icon.png"
const telone = "images/telone-logo.png"

export default function AgentSales() {
    const { user, setUser } = useAuth()

    const [message, setMessage] = useState('Enter date range and click search')
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [sales, setSales] = useState([])
    const [users, setUsers] = useState([])
    const [searchActive, setSearchActive] = useState(false)
    const [selectedUser, setSelectedUser] = useState({ id: null, name: '' })

    useEffect(() => {
        setupInterceptors(() => user, setUser)
    }, [user, setUser])

    const handleSearch = async () => {
        setLoading(true)
        if (!selectedUser.id && user.role !== "SALES_AGENT") {
            setMessage("Please select a user first")
            setLoading(false)
            return
        }
        setMessage("Loading, Please wait a moment")
        const formattedStartDate = startDate.toISOString().slice(0, 10)
        const formattedEndDate = endDate.toISOString().slice(0, 10)
        try {
            const response = await InsuranceApi.get(`/product-payments/by-sales-agent/${selectedUser.id || user.userId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
            if (response.data.code === "OK" && response.data.data.length > 0) {
                setSales(response.data.data)
            } else if (response.data.code === "NOT_FOUND") {
                setMessage("No sales record found")
            } else {
                setMessage("Error Fetching Resource")
            }
        } catch (err) {
            setMessage("Error Fetching Resource")
        } finally {
            setLoading(false)
        }
    }

    const handleNameChange = async (e) => {
        setUsers([])
        if (e.target.value.length > 2) {
            const response = await InsuranceApi.get(`/users/search?startingWord=${e.target.value}`)
            if (response.data.code === "OK" && response.data.data.length > 0) {
                setUsers(response.data.data)
            } else {
                setUsers([])
            }
        }
    }

    const printDocument = () => {
        const doc = new jsPDF('portrait', 'px', 'a4', 'false')
        const pageHeight = doc.internal.pageSize.height
        const pageWidth = doc.internal.pageSize.width
        const footerY = pageHeight - 40

        // Add logos
        doc.addImage(telone, 'PNG', 45, 40, 72, 28)
        doc.addImage(img, 'PNG', 340, 40, 72, 28)

        // Add title
        doc.setFont('Times New Roman', 'bold')
        doc.setFontSize(16)
        doc.setTextColor(15, 145, 209)
        doc.text(410, 95, 'Commission Report', { align: 'right' })

        // Add line
        doc.setLineWidth(0.5)
        doc.line(45, 110, 410, 110)

        // Add date
        const formattedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        doc.setFont('Times New Roman', 'bold')
        doc.setFontSize(12)
        doc.setTextColor(15, 145, 209)
        doc.text(45, 125, formattedDate)

        // Add table
        const headers = [
            ["Broker", "Policy", "Revenue Collections", "", "TelOne Commission", "", "Broker Remittance", ""],
            ["", "", "USD", "ZWG", "USD", "ZWG", "USD", "ZWG"]
        ]

        const body = commissions.flatMap(broker => [
            [broker.brokerName],
            ...broker.policyDetails.map(policy => [
                '',
                policy.policyName,
                policy.totalAmountUsd,
                policy.totalAmountZWG,
                policy.telOneCommissionUsd,
                policy.telOneCommissionZWG,
                policy.brokerRemmitanceUsd,
                policy.brokerRemmitanceZWG
            ])
        ])

        doc.autoTable({
            startY: 170,
            head: headers,
            body: body,
            theme: 'grid',
            styles: {
                fontSize: 7,
                cellPadding: 3,
                lineWidth: 0.5,
                lineColor: [220, 220, 220]
            },
            headStyles: {
                fillColor: [31, 41, 55],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 75 },
                2: { cellWidth: 35, align: 'right' },
                3: { cellWidth: 35, align: 'right' },
                4: { cellWidth: 35, align: 'right' },
                5: { cellWidth: 35, align: 'right' },
                6: { cellWidth: 35, align: 'right' },
                7: { cellWidth: 35, align: 'right' }
            }
        })

        // Add footer
        doc.setLineWidth(0.5)
        doc.line(45, footerY - 10, 410, footerY - 10)

        const footerText = "107 Kwame Nkrumah Avenue, Harare, Zimbabwe\nP.O Box CY 331, Causeway, Harare, Zimbabwe\n24 Hour Call Center - +263 0242 700950"
        doc.setFontSize(9)
        doc.setTextColor(112, 112, 112)
        doc.setFont('Times New Roman', 'regular')
        doc.text(pageWidth / 2, footerY, footerText, { align: "center" })

        doc.save('insureme.pdf')
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
                    { key: 'ZWG', label: 'Payment Method' },
                ],
            },
        ]

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
        ))
    }

    const renderTableRows = () => {
        return sales.length > 0 ? sales.map((item, index) => (
            <tr key={index} className={`${index % 2 !== 0 && "bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
                <td className='font-bold text-blue-5 justify-center items-center w-7'><div className='w-full justify-center flex items-center'>{index + 1}</div></td>
                <td>{item.insuranceCategory}</td>
                <td>{item.paymentStatus}</td>
                <div className="flex w-full justify-around">
                    <td>
                        {item.amount.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </td>
                    <td>
                        {item.paymentMethod}
                    </td>
                </div>
            </tr>
        )) : (
            <tr>
                <td colSpan={7} className="text-center">{message || "Error fetching resource"}</td>
            </tr>
        )
    }

    return (
        <div className="p-5 bg-white rounded-md border border-gray-200 border-solid">
            <h2 className="text-lg font-semibold">Agent Sales Report</h2>
            <div className='flex-col py-4 space-y-2'>
                <div className="grid grid-cols-4 items-center justify-between rounded-full border border-gray-400 gap-2">
                    <div className="flex rounded-full p-1 px-2 border-r border-gray-400">
                        <h6 className='mr-3'>Start Date:</h6>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            maxDate={new Date()}
                            className='w-[105px] outline-none rounded-3xl bg-gray-200 px-3 cursor-pointer'
                        />
                    </div>
                    <div className="flex rounded-full p-1 px-2 border-r border-gray-400">
                        <h6 className='mr-3'>End Date:</h6>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            maxDate={new Date()}
                            className='w-[105px] outline-none rounded-3xl bg-gray-200 px-3 cursor-pointer'
                        />
                    </div>
                    <div className="flex rounded-full p-1 px-2 border-r border-gray-400">
                        <select
                            id="transactionStatus"
                            name="transactionStatus"
                            className="bg-inherit rounded-xs cursor-pointer"
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
                            placeholder='Name'
                            onFocus={() => setSearchActive(true)}
                            onChange={handleNameChange}
                            className="block w-full rounded-full border-0 px-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-0 bg-gray-200 outline-none sm:text-sm sm:leading-6"
                        />
                        {users.length > 0 && searchActive && (
                            <div className="absolute mt-7 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <ul className="py-2">
                                    {users.map((user) => (
                                        <li
                                            key={user.id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setSelectedUser({ id: user.id, name: `${user.firstname} ${user.lastname}` })
                                                setSearchActive(false)
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
                        <label htmlFor="entries" className="block text-sm font-medium leading-6 text-gray-900">
                            Show
                        </label>
                        <select
                            id="entries"
                            name="entries"
                            className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5 cursor-pointer"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="All">All</option>
                        </select>
                        <label htmlFor="entries" className="block text-sm font-medium leading-6 text-gray-900">
                            Entries
                        </label>
                    </div>
                    <div className='flex justify-end w-56'>
                        <button
                            onClick={handleSearch}
                            className="space-x-2 border-gray-300 rounded-l-full px-3 h-8 items-center bg-blue-500 text-gray-100 hover:bg-blue-600"
                        >
                            <i className='fas fa-search text-xs' />
                            <span className='text-xs'>Search</span>
                        </button>
                        <button
                            onClick={printDocument}
                            className="space-x-2 border-gray-300 rounded-r-full px-3 h-8 items-center bg-gray-500 text-gray-100 hover:bg-gray-600"
                        >
                            <i className='fas fa-print text-xs' />
                            <span className='text-xs'>Print</span>
                        </button>
                    </div>
                </div>
            </div>
            {loading ? (
                <div className='flex justify-center'>
                    <ScaleLoader color='#374151' loading={loading} />
                    <h1 className='flex text-gray-700 justify-center'>{message}</h1>
                </div>
            ) : (
                sales.length > 0 ? (
                    <div className='overflow-auto rounded-xl shadow-md'>
                        <table className='w-full'>
                            <thead className='bg-gray-100 border-b-2 border-gray-300'>
                                <tr>{renderTableHeader()}</tr>
                            </thead>
                            <tbody>{renderTableRows()}</tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="flex flex-col">
                            <div className="bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
                                <div className="flex justify-center items-center bg-gray-700 text-white">
                                    <span className="font-semibold">{message }</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

