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

export default function ShopSales() {
  const [catResponse, setCatResponse] = useState("")
  const [message, setMessage] = useState("Enter date range and click search")
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [regions, setRegions] = useState("")
  const [regionId, setRegionId] = useState(0)
  const [towns, setTowns] = useState("")
  const [townId, setTownId] = useState(0)
  const [shops, setShops] = useState("")
  const [shopId, setShopId] = useState(0)
  const [sales, setSales] = useState("")

  const { user, setUser } = useAuth()

  const [regionResponse, setRegionResponse] = useState("")
  const [townResponse, setTownResponse] = useState("")
  const [shopResponse, setShopResponse] = useState("")

  useEffect(() => {
    setupInterceptors(() => user, setUser)
    fetchRegions()
  }, [user, setUser])

  const fetchRegions = async () => {
    setLoading(true)
    try {
      const response = await InsuranceApi.get("/region")
      if (response.data.code === "OK" && response.data.data.length > 0) {
        setRegions(response.data.data)
      } else if (response.data.code === "OK" && response.data.data.length < 1) {
        setRegionResponse("No Regions found")
      }
    } catch (err) {
      if (err) {
        setRegionResponse("Error fetching resource, Please check your network connection")
      } else if (err) {
        setRegionResponse("No Regions found")
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchTowns = async (id) => {
    try {
      const response = await InsuranceApi.get(`/town/region/${id}`)
      if (response.data.code === "OK" && response.data.data.length > 0) {
        setTowns(response.data.data)
      } else if (response.data.code === "OK" && response.data.data.length < 1) {
        setTownResponse("No towns found for this region")
      }
    } catch (err) {
      setTownResponse("Error fetching towns")
    }
  }

  const fetchShops = async (id) => {
    try {
      const response = await InsuranceApi.get(`/shop/town/${id}`)
      if (response.data.code === "OK" && response.data.data.length > 0) {
        setShops(response.data.data)
      } else if (response.data.code === "NOT_FOUND") {
        setShopResponse("No shops found for this town")
      }
    } catch (err) {
      setShopResponse("Error fetching towns")
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    setMessage("Loading, Please wait a moment")
    setSales(null)
    const formattedStartDate = new Date(startDate).toISOString().slice(0, 10)
    const formattedEndDate = new Date(endDate).toISOString().slice(0, 10)

    try {
      const response =
        regionId !== 0 && townId !== 0 && shopId !== 0
          ? await InsuranceApi.get(
              `/product-payments/by-shop?shopId=${shopId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
            )
          : regionId !== 0 && townId !== 0 && shopId === 0
            ? await InsuranceApi.get(
                `/product-payments/by-town?townId=${townId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
              )
            : await InsuranceApi.get(
                `/product-payments/by-region?regionId=${regionId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
              )

      console.log("post results: ", response)

      if (response.data.code === "OK") {
        setSales(response.data)
        setLoading(false)
      } else {
        setMessage("No sales record found")
      }
    } catch (err) {
        setLoading(false);
        console.log("Error fetching resource: ", err);
        if (err.response && err.response.status === 404) {
            setMessage(err.response.data.message);
        } else {
            setMessage("Error Fetching Resource");
        }
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }

  const renderTableHeader = () => {
    const columns = [
      { key: "item", label: "#", width: "1" },
      { key: "policy", label: "Policy Name" },
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
    return (
      <div className="flex justify-center">
        <span style={{ textAlign: "center" }} className="py-3">
          <ScaleLoader
            color="#374151"
            loading={loading}
            cssOverride={override}
            size={10} // Adjust the size as needed
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <h1 className="flex text-gray-700 justify-center">{message}</h1>
        </span>
      </div>
    )
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

  const getModal = (isOpen) => {
    setIsOpen(isOpen)
    // isOpen&&fetchCategoryData()
  }
  const getViewModal = (isOpen) => {
    setViewOpen(isOpen)
  }

  const generatePDF = () => {
    const doc = new jsPDF("portrait", "px", "a4", "false")
    const pageHeight = doc.internal.pageSize.height
    const footerY = pageHeight - 40
    const pageWidth = doc.internal.pageSize.width
    const text = "107 Kwame Nkrumah Avenue, Harare, Zimbabwe\nP.O Box CY 331, Causeway, Harare, Zimbabwe\n24 Hour Call Center - +263 0242 700950"
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
    doc.text(410, 95, `National Sales Report`, { align: "right" })
  
    // Add horizontal line
    doc.setLineWidth(0.5)
    doc.line(45, 110, 410, 110)
  
    // Add date
    const current = new Date()
    const formattedDate = current.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    })

    doc.setFont("Times New Roman", "bold")
    doc.setFontSize(12)
    doc.setTextColor(15, 145, 209)
    doc.text(45, 125, formattedDate)
  
    // Add report details
    doc.setFont("Times New Roman", "medium")
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(9)
    // doc.text(45, 140, `Region: ${getLocationInfo()}`)
    doc.text(45, 155, `Start Date: ${startDate.toLocaleDateString()}`)
    doc.text(45, 165, `End Date: ${endDate.toLocaleDateString()}`)
  
    // Calculate totals
    const totals = Object.values(sales.data).reduce(
      (acc, item) => {
        acc.ZWG += Number.parseFloat(item.ZWG) || 0
        acc.USD_TAX += Number.parseFloat(item.USD_TAX) || 0
        acc.ZWG_TAX += Number.parseFloat(item.ZWG_TAX) || 0
        return acc
      },
      { ZWG: 0, USD_TAX: 0, ZWG_TAX: 0 },
    )
  
    // Prepare table headers and data
    const headers = [
      ["#", "Policy Name", "Revenue Collections", "", "Tax Collections", ""],
      ["", "", "USD", "ZWG", "USD Tax", "ZWG Tax"],
    ]
  
    const tableRows = [
      ...Object.entries(sales.data).map(([policyName, policyData], index) => [
        index + 1,
        policyName,
        policyData.USD_TAX?.toFixed(2) || "0.00",
        policyData.ZWG?.toFixed(2) || "0.00",
        policyData.USD_TAX?.toFixed(2) || "0.00",
        policyData.ZWG_TAX?.toFixed(2) || "0.00",
      ]),
      // Add totals row
      [
        "",
        "Total",
        totals.USD_TAX.toFixed(2),
        totals.ZWG.toFixed(2),
        totals.USD_TAX.toFixed(2),
        totals.ZWG_TAX.toFixed(2),
      ],
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
        1: { cellWidth: 145 },
        2: { cellWidth: 50, halign: "right" },
        3: { cellWidth: 50, halign: "right" },
        4: { cellWidth: 50, halign: "right" },
        5: { cellWidth: 50, halign: "right" },
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
        if (data.section === "body" && data.row.index === Object.keys(sales).length) {
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
    doc.save("shop_sales_report.pdf")
  }

  return (
    <>
      <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
        {isOpen && <CategoryModal setModal={getModal} data={modalData} />}
        {viewOpen && <CategoryViewModal setModal={getViewModal} data={modalData} />}
        <h2 className="text-lg font-semibold">National Sales Report</h2>
        <div className="flex-col py-4 space-y-2">
          <div className="grid grid-cols-3 items-center justify-between rounded-full border border-gray-400 gap-2">
            <div className="flex rounded-full p-1 px-2 border-r border-gray-400 shadow-[0_0_10px_0_rgba(0,0,0,0.8)">
              <select
                id="regionId"
                name="regionId"
                value={regionId}
                onChange={(e) => {
                  setRegionId(Number(e.target.value))
                  fetchTowns(e.target.value)
                }}
                className=" bg-inherit rounded-xs cursor-pointer min-w-48"
              >
                <option value={0}>Select Region</option>
                {regions ? (
                  regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))
                ) : (
                  <option value={0} className="text-red-500">
                    {regionResponse}
                  </option>
                )}
              </select>
            </div>
            <div className="flex rounded-full p-1 px-2 border-r border-gray-400">
              <select
                id="townId"
                name="townId"
                value={townId}
                onChange={(e) => {
                  setTownId(Number(e.target.value))
                  fetchShops(e.target.value)
                }}
                className=" bg-inherit rounded-xs cursor-pointer"
              >
                <option value={0}>Select Town</option>
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
                onChange={(e) => {
                  setShopId(Number(e.target.value))
                }}
                className=" bg-inherit rounded-xs cursor-pointer"
              >
                <option value={0}>Select Shop</option>
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
              <h6 className="mr-3">Start Date:</h6>
              <DatePicker
                showPopperArrow
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                maxDate={new Date()}
                className="w-[105px] outline-none rounded-3xl bg-gray-200 px-3 cursor-pointer"
              />
            </div>
            <div className="flex rounded-full p-1 px-2 border-r border-gray-400">
              <h6 className="mr-3">End Date:</h6>
              <DatePicker
                showPopperArrow
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                maxDate={new Date()}
                className="w-[105px] outline-none rounded-3xl bg-gray-200 px-3 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center rounded-full border overflow-hidden border-gray-400 text-xs">
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
            <div className="flex justify-end w-56">
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