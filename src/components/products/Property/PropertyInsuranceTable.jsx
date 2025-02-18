"use client"

import { useEffect, useState } from "react"
import { ScaleLoader } from "react-spinners"
import DeleteConfirmationModal from "../../deleteConfirmation/deleteConfirmationModal"
import InsuranceApi, { setupInterceptors } from "../../api/InsuranceApi"
import PropertyInsuranceModal from "./PropertyInsuranceModal"
import PropertyInsuranceViewModal from "./PropertyInsuranceViewModal"
import useAuth from "../../../hooks/useAuth"

export default function PropertyInsuranceTable() {
  const { user, setUser } = useAuth()

  const [message, setMessage] = useState("")
  const [prodResponse, setProdResponse] = useState("")
  const [propertyInsurance, setPropertyInsurance] = useState([])
  const [insurers, setInsurers] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState("")
  const [isDelete, setIsDelete] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [modalData, setModalData] = useState(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setupInterceptors(() => user, setUser)
    getPropertyProducts()
    fetchInsurer()
  }, [user, setUser])

  useEffect(() => {
    setTotalPages(Math.ceil(propertyInsurance.length / itemsPerPage))
  }, [propertyInsurance, itemsPerPage])

  const getPropertyProducts = async () => {
    setLoading(true)
    const url =
      (user.role === "INSURER_ADMIN"||user.role==="IT_ADMIN"||user.role==="TREASURY_ACCOUNTANT"||user.role==="IT_SUPPORT"||user.role==="MANAGER"||user.role==="PRODUCT_MANAGER") ? `/insurer-property-rates/insurer/${user.companyId}` : `/insurer-property-rates`
    try {
      const response = await InsuranceApi.get(url)
      if (response.data.code === "OK" && response.data.data.length > 0) {
        setPropertyInsurance(response.data.data)
      } else if (response.data.code === "NOT_FOUND") {
        setProdResponse("No property plans found")
      } else if (response.data.code !== "OK") {
        setProdResponse("Error fetching resource, Please check your network connection")
      } else {
        setProdResponse("Error fetching resource, Please check your network connection")
      }
    } catch (err) {
      console.log(err.response)
      if (err.response.data.code === "NOT_FOUND") {
        setProdResponse("No property plans found")
      }
    }
    setLoading(false)
  }

  const getInsurerProducts = async (insurerId) => {
    setLoading(true)
    setPropertyInsurance([])
    const response = await InsuranceApi.get(`/insurer-property-rates/insurer/${insurerId}`)
    if (response.data.code === "OK" && response.data.data.length > 0) {
      setPropertyInsurance(response.data.data)
    } else if (response.data.code === "OK" && response.data.data.length < 1) {
      setProdResponse("No property plans found")
    } else if (response.data.code !== "OK") {
      setProdResponse("Error fetching resource, Please check your network connection")
    } else {
      setProdResponse("Error fetching resource, Please check your network connection")
    }
    setLoading(false)
  }

  const fetchInsurer = async () => {
    try {
      const response = await InsuranceApi.get(`/insurers`)
      if (response) {
        setInsurers(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = (insuranceId) => {
    setLoading(true)
    setMessage("Deleting...")
    setIsDelete(true)
  }

  const renderTableHeader = () => {
    const columns = [
      { key: "item", label: "#", width: "1" },
      { key: "policy", label: "Policy" },
      { key: "policyType", label: "Policy Type" },
      { key: "action", label: "Action" },
    ]

    return columns.map((column) => (
      <th
        key={column.key}
        className={`text-sm font-bold tracking-wide text-left ${column.width ? "p-3 w-" + column.width : "py-3"} ${column.key === "status" && "text-center"} ${column.key === "action" && "text-center"}`}
      >
        <span className="mr-2">{column.label}</span>
      </th>
    ))
  }

  const loadingAnimation = () => {
    return (
      <tr>
        <td colSpan={7} style={{ textAlign: "center" }} className="py-3">
          <ScaleLoader
            color="#374151"
            loading={loading}
            cssOverride={override}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <h1 className="flex text-gray-700 justify-center">{message}</h1>
        </td>
      </tr>
    )
  }

  const renderTableRows = () => {
    if (!propertyInsurance || propertyInsurance.length === 0) {
      return (
        <tr>
          <td colSpan={7} style={{ textAlign: "center" }}>
            {prodResponse || "No products available."}
          </td>
        </tr>
      )
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = propertyInsurance.slice(indexOfFirstItem, indexOfLastItem)

    return currentItems.map((item, index) => (
      <tr
        key={item.insuranceId}
        className={`${index % 2 !== 0 ? "bg-gray-100" : ""} p-3 text-sm text-gray-600 font-semibold`}
      >
        <td className="font-bold text-blue-500 justify-center items-center w-7">
          <div className="w-full justify-center flex items-center">{index + 1 + (currentPage - 1) * itemsPerPage}</div>
        </td>
        <td>{item.policy}</td>
        <td>{item.policyType}</td>
        <td className="py-1 space-x-0 justify-center">
          <div className="w-full justify-center flex items-center">
            <button
              onClick={() => {
                setModalData(item)
                setViewOpen(true)
              }}
              className={`${(user.role==="TREASURY_ACCOUNTANT"||user.role==="MANAGER"||user.role==="PRODUCT_MANAGER")? " rounded-full w-32":" rounded-l-full"} space-x-2 items-center border-gray-300 px-4 h-6 m bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
            >
              <i className="fas fa-eye text-xs" />
              <span className="text-xs">View</span>
            </button>
            {
              (user.role !== "TREASURY_ACCOUNTANT" && user.role !== "MANAGER" && user.role !== "PRODUCT_MANAGER") &&
              <>
                <button
                  onClick={() => {
                    setModalData(item)
                    setIsOpen(true)
                  }}
                  className={`space-x-2 border-gray-300 items-center px-4 h-6 bg-blue-500 text-gray-100 hover:text-blue-500 hover:bg-white`}
                >
                  <i className="fas fa-pen text-xs" />
                  <span className="text-xs">Update</span>
                </button>
                <button
                  onClick={() => {
                    setItemId(item.insuranceId)
                    setIsDelete(true)
                  }}
                  className={`space-x-2 border-gray-300 items-center rounded-r-full px-4 h-6 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                >
                  <i className="fas fa-trash text-xs" />
                  <span className="text-xs">Delete</span>
                </button>
              </>
            }
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

  const handleItemsPerPageChange = (e) => {
    const value = e.target.value
    setItemsPerPage(value === "All" ? propertyInsurance.length : Number.parseInt(value))
    setCurrentPage(1)
  }

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
                  className={`px-3 py-1 rounded-full ${currentPage === number ? "bg-main-color text-white" : "bg-gray-200"}`}
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

  return (
    <>
      <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
        {isOpen && <PropertyInsuranceModal setModal={getModal} data={modalData} />}
        {viewOpen && <PropertyInsuranceViewModal setModal={getViewModal} data={modalData} />}
        {isDelete && (
          <DeleteConfirmationModal
            deleteOpen={isDelete}
            onClose={() => setIsDelete(false)}
            onDelete={() => handleDelete(itemId)}
          />
        )}
        <h2 className="text-lg font-semibold">Insurance Type Data</h2>
        <div className="flex justify-between py-4">
          <div className="flex items-center rounded-full border overflow-hidden border-gray-500 text-xs h-8">
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
          <div className={`${(user.role==="TREASURY_ACCOUNTANT"||user.role==="MANAGER"||user.role==="PRODUCT_MANAGER") ? "hidden" : ""} flex items-center space-x-2`}>
            <label htmlFor="insuranceCompany" className="block text-sm font-medium leading-6 text-gray-900">
              Filter By Insurance Company
            </label>
            <div className="">
              <select
                id="insuranceCompany"
                name="insuranceCompany"
                className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5"
                onChange={(e) => {
                  if (e.target.value === "") {
                    getPropertyProducts()
                  } else {
                    getInsurerProducts(e.target.value)
                  }
                }}
              >
                <option value="">Select Company</option>
                {insurers ? (
                  insurers.map((insurer, index) => (
                    <option key={index} value={insurer.insurerId}>
                      {insurer.insurerName}
                    </option>
                  ))
                ) : (
                  <option value="">No Policy</option>
                )}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-auto rounded:xl shadow-md">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>{renderTableHeader()}</tr>
            </thead>
            <tbody>{loading ? loadingAnimation() : renderTableRows()}</tbody>
          </table>
        </div>
        {renderPagination()}
      </div>
    </>
  )
}

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
}
