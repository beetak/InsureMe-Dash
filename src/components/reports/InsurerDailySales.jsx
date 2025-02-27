"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ScaleLoader } from "react-spinners"
import jsPDF from "jspdf"
import "jspdf-autotable"
import CategoryModal from "../category/CategoryModal"
import CategoryViewModal from "../category/CategoryViewModal"
import useAuth from "../../hooks/useAuth"
import InsuranceApi, { setupInterceptors } from "../api/InsuranceApi"

const img = "images/icon.png"
const telone = "images/telone-logo.png"

export default function InsurerDailySales() {
  const { user, setUser } = useAuth()

  useEffect(() => {
    setupInterceptors(() => user, setUser)
  }, [user, setUser])

  const [message, setMessage] = useState("Enter report date and click search")
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [transactionDate, setTransactionDate] = useState(new Date())
  const [sales, setSales] = useState("")

  const handleSearch = async () => {
    setLoading(true)
    setSales("")
    setMessage("Loading, Please wait a moment")
    const formattedStartDate = new Date(transactionDate).toISOString().slice(0, 10)
    const formattedEndDate = new Date(transactionDate).toISOString().slice(0, 10)
    try {
      const response = await InsuranceApi.get(
        `/product-payments/by-insurer/${user.companyId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      )

      if (response.data.code === "OK") {
        setMessage(response.data.message)
        setSales(response.data)
        setLoading(false)
      } else if (response.data.code === "NOT_FOUND") {
        setLoading(false)
        setMessage("No sales record found")
      } else {
        setLoading(false)
        setMessage("Error Fetching Resource")
      }
    } catch (err) {
      setLoading(false)
      setMessage(err.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  const renderTableHeader = () => {
    const columns = [
      { key: "item", label: "#", width: "1" },
      { key: "category", label: "Insurance Category" },
      { key: "count", label: "Sold Policies" },
      {
        key: "revenue",
        label: "Revenue Collections",
        subHeaders: [
          { key: "usd", label: "USD" },
          { key: "zwg", label: "ZWG" },
        ],
      },
    ]

    return columns.map((column) => (
      <th
        key={column.key}
        className={`text-sm font-bold tracking-wide text-left ${column.width ? "p-3 w-" + column.width : "py-3"} ${column.key === "revenue" && "text-center"}`}
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
    return (
      <div className="flex justify-center">
        <span style={{ textAlign: "center" }} className="py-3">
          <ScaleLoader
            color="#374151"
            loading={loading}
            cssOverride={override}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <h1 className="flex text-gray-700 justify-center">{message}</h1>
        </span>
      </div>
    )
  }

  const renderTableRows = () => {
    if (!sales || !sales.data || !Array.isArray(sales.data)) {
      return (
        <tr>
          <td colSpan={4} className="text-center py-4">
            {message || "No data available"}
          </td>
        </tr>
      )
    }

    return sales.data.map((item, index) => (
      <tr
        key={`${item.insuranceCategory}-${index}`}
        className={`p-3 text-sm text-gray-600 font-semibold ${index % 2 === 1 ? "bg-gray-50" : ""}`}
      >
        <td className="font-bold text-blue-5 justify-center items-center w-7">
          <div className="w-full justify-center flex items-center">{index + 1}</div>
        </td>
        <td>{item.insuranceCategory}</td>
        <td>{item.totalCount}</td>
        <td>
          <div className="flex w-full justify-around">
            <div>{item.amounts.USD ? item.amounts.USD.toFixed(2) : "0.00"}</div>
            <div>{item.amounts.ZWG ? item.amounts.ZWG.toFixed(2) : "0.00"}</div>
          </div>
        </td>
      </tr>
    ))
  }

  const getModal = (isOpen) => {
    setIsOpen(isOpen)
  }

  const getViewModal = (isOpen) => {
    setViewOpen(isOpen)
  }

  const generatePDF = () => {
    if (!sales || !sales.data) return

    const doc = new jsPDF("portrait", "px", "a4", "false")
    const pageHeight = doc.internal.pageSize.height
    const footerY = pageHeight - 40
    const pageWidth = doc.internal.pageSize.width
    const text =
      "107 Kwame Nkrumah Avenue, Harare, Zimbabwe\nP.O Box CY 331, Causeway, Harare, Zimbabwe\n24 Hour Call Center - +263 0242 700950"
    const textWidth = doc.getTextWidth(text)
    const centerX = (pageWidth - textWidth) / 2
    const textX = centerX - textWidth / -2

    // Add logos
    doc.addImage(telone, "PNG", 45, 40, 72, 28)
    doc.addImage(img, "PNG", 340, 40, 72, 28)

    // Add title
    doc.setFont("Times New Roman", "bold")
    doc.setFontSize(16)
    doc.setTextColor(15, 145, 209)
    doc.text(410, 95, `Insurer Daily Sales Report`, { align: "right" })

    // Add horizontal line
    doc.setLineWidth(0.5)
    doc.line(45, 110, 410, 110)

    // Add date
    const current = new Date()
    const formattedDate = current.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })

    doc.setFont("Times New Roman", "bold")
    doc.setFontSize(12)
    doc.setTextColor(15, 145, 209)
    doc.text(45, 125, formattedDate)

    // Add report details
    doc.setFont("Times New Roman", "medium")
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(9)
    doc.text(45, 155, `Report Date: ${transactionDate.toLocaleDateString()}`)
    doc.text(45, 165, `Insurer: ${sales.data[0]?.insurerName || "N/A"}`)

    // Calculate totals
    const totals = sales.data.reduce(
      (acc, item) => {
        acc.totalPolicies += item.totalCount
        acc.USD += Number.parseFloat(item.amounts.USD) || 0
        acc.ZWG += Number.parseFloat(item.amounts.ZWG) || 0
        return acc
      },
      { totalPolicies: 0, USD: 0, ZWG: 0 },
    )

    // Prepare table headers and data
    const headers = [
      ["#", "Insurance Category", "Sold Policies", "Revenue Collections", ""],
      ["", "", "", "USD", "ZWG"],
    ]

    const tableRows = [
      ...sales.data.map((item, index) => [
        index + 1,
        item.insuranceCategory,
        item.totalCount,
        item.amounts.USD?.toFixed(2) || "0.00",
        item.amounts.ZWG?.toFixed(2) || "0.00",
      ]),
      // Add totals row
      ["", "Total", totals.totalPolicies, totals.USD.toFixed(2), totals.ZWG.toFixed(2)],
    ]

    // Generate table
    doc.autoTable({
      startY: 180,
      head: headers,
      body: tableRows,
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
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 7,
        halign: "left",
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" },
        1: { cellWidth: 120 },
        2: { cellWidth: 50, halign: "center" },
        3: { cellWidth: 75, halign: "right" },
        4: { cellWidth: 75, halign: "right" },
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
        if (data.section === "body" && data.row.index === sales.data.length) {
          doc.setFont("Times New Roman", "bold")
          doc.setFillColor(240, 240, 240)
        }
      },
    })

    // Add footer line and text
    doc.setLineWidth(0.5)
    doc.line(45, footerY - 10, 410, footerY - 10)

    doc.setFontSize(9)
    doc.setTextColor(112, 112, 112)
    doc.setFont("Times New Roman", "regular")
    doc.text(textX, footerY, text, { align: "center" })

    // Save the PDF
    doc.save("insurer_daily_sales_report.pdf")
  }

  return (
    <>
      <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
        {isOpen && <CategoryModal setModal={getModal} data={modalData} />}
        {viewOpen && <CategoryViewModal setModal={getViewModal} data={modalData} />}
        <h2 className="text-lg font-semibold">Insurer Daily Sales Report</h2>
        <div className="flex justify-between py-4">
          <div className="flex items-center rounded-full border overflow-hidden border-gray-500 text-xs">
            <label
              htmlFor="last-name"
              className="w-16 font-medium leading-6 px-2 py-1 bg-gray-500 justify-center flex text-white"
            >
              Show
            </label>
            <div className="">
              <select id="systemAdOns" name="systemAdOns" className="bg-inherit px-3 py-1 cursor-pointer">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="All">All</option>
              </select>
            </div>
            <label
              htmlFor="last-name"
              className="w-16 font-medium leading-6 px-2 py-1 bg-gray-500 justify-center flex text-white"
            >
              Entries
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-full justify-center flex items-center">
              <div className="flex items-center justify-between rounded-full border border-gray-400 mr-1">
                <div className="flex rounded-full p-1 border-r border-gray-400">
                  <h6 className="mr-3">Date:</h6>
                  <DatePicker
                    showPopperArrow
                    selected={transactionDate}
                    onChange={(date) => setTransactionDate(date)}
                    maxDate={new Date()}
                    className="w-[105px] outline-none rounded-3xl bg-gray-200 px-1 cursor-pointer"
                  />
                </div>
              </div>
              <div className="md:flex-col md:justify-center">
                <button
                  onClick={() => handleSearch()}
                  className={`space-x-2 border-gray-300 rounded-l-full px-3 h-8 items-center bg-blue-500 text-gray-100 hover:bg-blue-600`}
                >
                  <i className="fas fa-search text-xs" />
                  <span className="text-xs">Search</span>
                </button>
                <button
                  onClick={() => generatePDF()}
                  className={`space-x-2 border-gray-300 rounded-r-full px-3 h-8 items-center bg-gray-500 text-gray-100 hover:bg-gray-600`}
                >
                  <i className="fas fa-print text-xs" />
                  <span className="text-xs">Print</span>
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