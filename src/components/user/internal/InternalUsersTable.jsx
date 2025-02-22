"use client"

import { useEffect, useState } from "react"
import { ScaleLoader } from "react-spinners"
import InternalUserModal from "./InternalUserModal"
import InternalUserViewModal from "./InternalUserViewModal"
import DeleteConfirmationModal from "../../deleteConfirmation/deleteConfirmationModal"
import useAuth from "../../../hooks/useAuth"
import InsuranceApi, { setupInterceptors } from "../../api/InsuranceApi"
import ResetConfirmationModal from "../../resetConfirmation/resetConfirmation"

export default function InternalUsersTable() {
  const { user, setUser } = useAuth()

  const [userResponse, setUserResponse] = useState("")
  const [resetName, setResetName] = useState("")
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [itemId, setItemId] = useState("")
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(()=>{
      setupInterceptors(() => user, setUser)
      fetchUsers()
  },[user, setUser])
  
  useEffect(() => {
    if (users) {
        setTotalPages(Math.ceil(users.length / itemsPerPage));
    } else {
        setTotalPages(0); // or any default value you prefer
    }
  }, [users, itemsPerPage]);
  
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await InsuranceApi.get("/users")
      if (response && response.data) {
        console.log(response.data)
        setUsers(response.data.data)
      }
    } catch (err) {
      console.log(err)
      if (err) {
        setUserResponse("Error fetching resource, Please check your network connection")
      } else {
        setUserResponse("No Users found")
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchUsersByRole = async (role) => {
    setUsers([])
    setLoading(true)
    try {
      const response = await InsuranceApi.get(`/users/by-role?role=${role}`)
      if (response && response.data) {
        setUsers(response.data.data)
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setUserResponse("No Insurers found");
        } else {
          setUserResponse("An error occurred: " + err.response.data.message);
        }
      } else if (err.request) {
        setUserResponse("No response received from the server");
      } else {
        setUserResponse("Error: " + err.message);
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setLoading(true)
    setMessage("Deleting...")
    setIsDelete(true)
    try {
      const response = await InsuranceApi.delete(`/users/${id}`)
      if (response && response.data.code === "OK") {
        setMessage("Deleted")
      }
    } catch (err) {
      console.log(err)
      setMessage("Error deleting user")
    } finally {
      setTimeout(() => {
        setLoading(false)
        setIsDelete(false)
        setMessage("")
      }, 1000)
      fetchUsers()
    }
  }

  const handleReset = async (id) => {
    setLoading(true)
    setMessage("Reseting...")
    setIsReset(true)
    try {
      const response = await InsuranceApi.put(`/users/reset/${id}`)
      if (response && response.data.code === "OK") {
        setMessage("Reset")
      }
    } catch (err) {
      console.log(err)
      setMessage("Error reseting user")
    } finally {
      setTimeout(() => {
        setLoading(false)
        setIsReset(false)
        setMessage("")
      }, 1000)
      fetchUsers()
    }
  }

  const renderTableHeader = () => {
    const columns = [
      { key: "item", label: "#", width: "1" },
      { key: "firstname", label: "Firstname" },
      { key: "lastname", label: "Lastname" },
      { key: "role", label: "Role" },
      { key: "status", label: "Status" },
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
          <h1 className="flex text-gray-700 justify-center">Loading</h1>
        </td>
      </tr>
    )
  }

  const renderTableRows = () => {
    if (!users || users.length === 0) {
      return (
        <tr>
          <td colSpan={7} style={{ textAlign: "center" }}>
            {userResponse || "No users available."}
          </td>
        </tr>
      )
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem)

    return currentItems.map((item, index) => (
      <tr
        key={index}
        className={`${index % 2 !== 0 ? "bg-gray-100" : ""} p-3 text-sm text-gray-600 font-semibold`}
      >
          <td className="font-bold text-blue-500 justify-center items-center w-7">
              <div className="w-full justify-center flex items-center">{index + 1 + (currentPage - 1) * itemsPerPage}</div>
          </td>
          <td>{item.firstname}</td>
          <td>{item.lastname}</td>
          <td>{item.role}</td>
          <td className="">
            <div className="w-full justify-center flex items-center">
              <span
                className={`font-semibold uppercase text-xs tracking-wider px-3 text-white ${item.active ? "bg-green-600" : "bg-red-600"} rounded-full py-1`}
              >
                {item.active ? "Active" : "Inactive"}
              </span>
            </div>
          </td>
          <td className="py-1 space-x-0 justify-center">
            <div className="w-full justify-center flex items-center">
              <button
                onClick={() => {
                  setModalData(item)
                  setViewOpen(true)
                }}
                className="space-x-2 items-center border-gray-300 rounded-l-full px-4 h-6 m bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white"
              >
                <i className="fas fa-eye text-xs" />
                <span className="text-xs">View</span>
              </button>
              <button
                onClick={() => {
                  setModalData(item)
                  setIsOpen(true)
                }}
                className="space-x-2 border-gray-300 items-center px-4 h-6 bg-blue-500 text-gray-100 hover:text-blue-500 hover:bg-white"
              >
                <i className="fas fa-pen text-xs" />
                <span className="text-xs">Update</span>
              </button>
              <button
                onClick={() => {
                  setItemId(item.id)
                  setResetName(item.firstname+" "+item.lastname)
                  setIsReset(true)
                }}
                className="space-x-2 border-gray-300 items-center px-4 h-6 bg-white text-blue-500 hover:text-white hover:bg-blue-500"
              >
                <i className="fas fa-pen text-xs" />
                <span className="text-xs">Reset Pass</span>
              </button>
              <button
                onClick={() => {
                  setItemId(item.id)
                  setIsDelete(true)
                }}
                className="space-x-2 border-gray-300 items-center rounded-r-full px-4 h-6 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white"
              >
                <i className="fas fa-trash text-xs" />
                <span className="text-xs">Delete</span>
              </button>
            </div>
          </td>
        </tr>
      ))
  }

  const roles = [ 
    "SUPER_ADMINISTRATOR", 
    "SALES_AGENT", 
    "SHOP_SUPERVISOR", 
    "BUSINESS_PERFORMANCE_SUPERVISOR", 
    "AREA_BUSINESS_MANAGER", 
    "REGIONAL_GENERAL_MANAGER", 
    "REGIONAL_ACCOUNTANT", 
    "FINANCE_MANAGER", 
    "ADMIN" 
  ]

  const getModal = (isOpen) => {
    setIsOpen(isOpen)
  }

  const getViewModal = (isOpen) => {
    setViewOpen(isOpen)
  }

  const handleItemsPerPageChange = (e) => {
    const value = e.target.value
    setItemsPerPage(value === "All" ? users.length : Number.parseInt(value))
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
        {isOpen && <InternalUserModal setModal={getModal} data={modalData} refresh={fetchUsers} />}
        {viewOpen && <InternalUserViewModal setModal={getViewModal} data={modalData} />}
        {isDelete && (
          <DeleteConfirmationModal
            deleteOpen={isDelete}
            onClose={() => setIsDelete(false)}
            userName={resetName}
            onDelete={() => handleDelete(itemId)}
          />
        )}
        {isReset && (
          <ResetConfirmationModal
            resetOpen={isReset}
            userName={resetName}
            onClose={() => setIsReset(false)}
            onReset={() => handleReset(itemId)}
          />
        )}
        <h2 className="text-lg font-semibold">Internal Users Table</h2>
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
          <div className="flex items-center rounded-full border overflow-hidden border-gray-500 text-xs ml-4">
            <label
              htmlFor="insurerId" 
              className="w-16 font-medium leading-6 px-2 py-1 bg-gray-500 justify-center flex text-white"
            >
              Filter By:
            </label>
            <label
              htmlFor="insurerId"
              className="w-16 font-medium leading-6 px-2 py-1 bg-gray-500 justify-center flex text-white"
            >
              Role
            </label>
            <div className="">
              <select
                id="role"
                name="role"
                className="bg-inherit px-3 py-1 cursor-pointer"
                onChange={(e) => {
                  setSelectedRole(e.target.value)
                  if (e.target.value === "") {
                    fetchUsers()
                  } else {
                    fetchUsersByRole(e.target.value)
                  }
                }}
                value={selectedRole}
              >
                <option value="">Select Role</option>
                <option value="" className="italic">Select for all</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-auto rounded-xl shadow-md">
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