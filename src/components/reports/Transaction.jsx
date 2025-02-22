"use client"

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { ScaleLoader } from "react-spinners"
import InsuranceApi, { setupInterceptors } from "../api/InsuranceApi"
import useAuth from "../../hooks/useAuth"
import Motor from "./TransactionalReport/Motor"
import Property from "./TransactionalReport/Property"
import Travel from "./TransactionalReport/Travel"
import { usePrint } from "../../context/PrinterProvider"

export default function Transaction() {
  // ... keep existing state and hooks ...
  const { user, setUser } = useAuth()
  const { setPrintData } = usePrint()
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [message, setMessage] = useState("Enter reference ID and click search")
  const [sales, setSales] = useState(null)
  const [transactions, setTransactions] = useState(null)
  const [referenceId, setReferenceId] = useState("")

  // Add these state variables at the top with other state declarations
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setupInterceptors(() => user, setUser)
  }, [user, setUser])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const refId = params.get("referenceId")
    if (refId) {
      setReferenceId(refId)
      handleSearch(refId)
    }
  }, [location])

  // Add this useEffect after other useEffects
  useEffect(() => {
    if (transactions) {
      setTotalPages(Math.ceil(transactions.length / itemsPerPage))
    }
  }, [transactions, itemsPerPage])

  const handleSearch = async (searchRefId = referenceId) => {
    setLoading(true)
    setMessage("Loading, Please wait a moment")

    try {
      const response = await InsuranceApi.get(`/product-payments/by-reference-number?referenceNumber=${searchRefId}`)

      if (response.data.code === "OK") {
        if (response.data.data.length > 0) {
          console.log(response.data.data[0].transactionDescription)
          const transactionDescriptionString = response.data.data[0].transactionDescription

          try {
            const transactionDescription = JSON.parse(transactionDescriptionString)
            response.data.data[0].transactionDescription = transactionDescription
          } catch (parseError) {
            console.error("Error parsing transactionDescription:", parseError)
            response.data.data[0].transactionDescription = {}
            setMessage("Error parsing transaction description")
          }

          setSales(response.data.data[0])
          setMessage("") // Clear message on success
        } else {
          setSales(null)
          setMessage("No sales record found")
        }
      } else {
        setSales(null)
        setMessage("Error Fetching Resource")
      }
    } catch (err) {
      console.error("Error fetching resource:", err)
      setSales(null)
      setMessage("Error Fetching Resource")
    } finally {
      setLoading(false)
    }
  }

  const handleSearchValue = async () => {
    setLoading(true)
    setMessage("Loading, Please wait a moment")
    setSales(null)

    try {
      const response = await InsuranceApi.get(`/product-payments/by-phone-or-email?phoneNumber=${searchValue}`)

      if (response.data.code === "OK") {
        // Set transactions directly from the response data
        setTransactions(response.data.data)
        setMessage("") // Clear message on success

        if (!response.data.data || response.data.data.length === 0) {
          setTransactions(null)
          setMessage("No transactions found")
        }
      } else {
        setTransactions(null)
        setMessage("Error Fetching Resource")
      }
    } catch (err) {
      console.error("Error fetching resource:", err)
      setTransactions(null)
      setMessage("Error Fetching Resource")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setSearchValue("")
    setReferenceId(e.target.value)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
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

  const handlePrint = () => {
    setPrintData(sales?.insuranceCategory)
  }

  function renderTransactionItems() {
    if (sales?.insuranceCategory === "MOTOR_VEHICLE") {
      return <Motor sales={sales} printDocument={handlePrint} />
    } else if (sales?.insuranceCategory === "TRAVEL") {
      return <Travel sales={sales} printDocument={handlePrint} />
    } else if (sales?.insuranceCategory === "PROPERTY") {
      return <Property sales={sales} printDocument={handlePrint} />
    } else {
      return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col">
            <div className="bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
              <div className="flex justify-center items-center bg-gray-700 text-white">
                <span className="font-semibold">No transaction details found</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  // Add this function before renderTransactionList
  const handleItemsPerPageChange = (e) => {
    const value = e.target.value
    setItemsPerPage(value === "All" ? transactions?.length || 5 : Number(value))
    setCurrentPage(1)
  }

  // Add this function before renderTransactionList
  const renderPagination = () => {
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="flex">
            {pageNumbers.map((number) => (
              <li key={number} className="mx-1">
                <button
                  onClick={() => setCurrentPage(number)}
                  className={`px-3 py-1 rounded-full ${
                    currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    )
  }

  // Modify the renderTransactionList function to include pagination
  const renderTransactionList = () => {
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col">
            <div className="bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
              <div className="flex justify-center items-center bg-gray-700 text-white">
                <span className="font-semibold">No transactions found</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem)

    return (
      <>
        <div className="flex items-center rounded-full border overflow-hidden border-gray-500 text-xs h-8 mb-4 w-fit">
          <label
            htmlFor="itemsPerPage"
            className="w-16 font-medium leading-6 px-2 py-1 bg-gray-500 justify-center flex text-white"
          >
            Show
          </label>
          <div className="">
            <select
              id="itemsPerPage"
              name="itemsPerPage"
              className="bg-inherit px-3 py-1 cursor-pointer"
              onChange={handleItemsPerPageChange}
              value={itemsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="All">All</option>
            </select>
          </div>
          <label
            htmlFor="itemsPerPage"
            className="w-16 font-medium leading-6 px-2 py-1 bg-gray-500 justify-center flex text-white"
          >
            Entries
          </label>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Insurance Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((transaction) => {
                  let customerName = "N/A"
                  try {
                    const transDesc = JSON.parse(transaction.transactionDescription)
                    customerName = transDesc.user?.fullName || "N/A"
                  } catch (e) {
                    console.error("Error parsing transaction description:", e)
                  }

                  return (
                    <tr key={transaction.referenceNumber} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.referenceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.insuranceCategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.paymentDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setReferenceId(transaction.referenceNumber)
                            handleSearch(transaction.referenceNumber)
                          }}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        {renderPagination()}
      </>
    )
  }

  return (
    <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
      <h2 className="text-lg font-semibold">Transaction Report</h2>
      <div className="flex justify-between py-4">
        <div className="xl:col-span-3 flex items-center space-x-2">
          <div className="flex items-center justify-between rounded-full border border-gray-400 mr-1">
            <div className="flex p-1 px-2">
              <input
                type="text"
                name="referenceId"
                id="referenceId"
                value={referenceId}
                autoComplete="off"
                placeholder="Transaction Reference"
                onChange={handleInputChange}
                className="block w-full rounded-xs border-0 px-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-0 bg-gray-200 rounded-full outline-none sm:text-sm sm:leading-6"
                aria-label="Transaction Reference ID"
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-full border border-gray-400 mr-1">
            <div className="flex p-1 px-2">
              <input
                type="text"
                name="searchValue"
                id="searchValue"
                value={searchValue}
                autoComplete="off"
                placeholder="Search by Email/ Phone Number"
                onChange={(e) => {
                  setReferenceId("")
                  setSearchValue(e.target.value)
                }}
                className="block w-full rounded-xs border-0 px-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-0 bg-gray-200 rounded-full outline-none sm:text-sm sm:leading-6"
                aria-label="Name Search"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-full justify-center flex items-center">
            <div className="md:flex-col md:justify-center">
              <button
                onClick={() => {
                  if (referenceId !== "") {
                    // Call the handleSearch function for referenceId
                    handleSearch(referenceId)
                  } else if (searchValue !== null && searchValue.trim() !== "") {
                    // Call the handleSearchValue function for searchValue
                    handleSearchValue(searchValue)
                  } else {
                    // Warn that at least one value is needed
                    alert("Please provide at least one value for search.")
                  }
                }}
                className="space-x-2 border-gray-300 rounded-l-full px-3 h-8 items-center bg-blue-500 text-gray-100 hover:bg-blue-600"
                aria-label="Search"
              >
                <i className="fas fa-search text-xs" />
                <span className="text-xs">Search</span>
              </button>
              <button
                onClick={() => handlePrint()}
                className="space-x-2 border-gray-300 rounded-r-full px-3 h-8 items-center bg-gray-500 text-gray-100 hover:bg-gray-600"
                aria-label="Print"
                disabled={!sales}
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
            <>
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-2">
                <div className="flex flex-col">
                  <div className="bg-gray-300 text-gray-700 py-3 px-6">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-semibold">Total Paid</span>
                        <span className="font-semibold">Transaction Reference Number</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-semibold">{formatCurrency(sales.amount)}</span>
                        <span className="font-semibold">{sales.referenceNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {renderTransactionItems()}
            </>
          ) : transactions ? (
            renderTransactionList()
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex flex-col">
                <div className="bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
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
  )
}

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
}