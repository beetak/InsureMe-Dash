"use client"

import { useEffect, useState } from "react"
import Modal from "../../modal/Modal"
import { HashLoader } from "react-spinners"
import InsuranceApi, { setupInterceptors } from "../../api/InsuranceApi"
import useAuth from "../../../hooks/useAuth"

export default function RegionModal({ data, refresh, setModal }) {
  const { user, setUser } = useAuth()

  useEffect(() => {
    setupInterceptors(() => user, setUser)
  }, [user, setUser])

  const [name, setName] = useState(data.name)
  const [active, setActive] = useState(data.active)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setName(data.name)
    setActive(data.active)
  }, [data])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await InsuranceApi.put(`/region?id=${data.id}&name=${name}&active=${active}`)
      if (response.data && response.data.code === "OK") {
        setSuccess(true)
      } else {
        setFailed(true)
      }
    } catch (error) {
      setFailed(true)
      setError("An error occurred while updating the region.")
    } finally {
      setTimeout(() => {
        setLoading(false)
        setFailed(false)
        setSuccess(false)
        refresh()
        setModal(false)
      }, 1000)
    }
  }

  return (
    <Modal setModal={setModal}>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Organisational Regions Modification</h2>
          <p className="text-xs mb-4">Edit the name and active status</p>
        </div>
        {loading && (
          <div className="flex flex-col items-center justify-center py-3">
            <HashLoader
              color={failed ? "#DF3333" : success ? "#4CAF50" : "#3B82F6"}
              loading={loading}
              cssOverride={override}
              size={30}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <p
              className={`mt-2 text-sm ${failed ? "text-red-500" : success ? "text-green-500" : "text-blue-500"} italic`}
            >
              {failed ? "Failed" : success ? "Success" : "Loading"}
            </p>
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="space-y-4">
          <div className="sm:col-span-3 flex items-center">
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
              Name
            </label>
            <div className="mt-2 flex-1">
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-3 flex items-center">
            <label htmlFor="active" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
              Active Status
            </label>
            <div className="mt-2 flex-1">
              <select
                id="active"
                name="active"
                value={active.toString()}
                onChange={(e) => setActive(e.target.value === "true")}
                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 pt-10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Update
          </button>
          <button
            onClick={() => setModal(false)}
            disabled={loading}
            className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
}