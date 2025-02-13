"use client"

import { useEffect, useState } from "react"
import Modal from "../../modal/Modal"
import { HashLoader } from "react-spinners"
import InsuranceApi, { setupInterceptors } from "../../api/InsuranceApi"
import useAuth from "../../../hooks/useAuth"

export default function ShopModal({ data, refresh, setModal }) {

    const { user, setUser } = useAuth()

    const [name, setName] = useState(data.name)
    const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber)
    const [address, setAddress] = useState(data.address)
    const [townId, setTownId] = useState(data.townId)
    const [active, setActive] = useState(data.active)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState("")
    const [townResponse, setTownResponse] = useState("")
    const [towns, setTowns] = useState("")


    useEffect(() => {
      setupInterceptors(()=>user, setUser)
      fetchTowns()
    }, [])

    useEffect(() => {
      setName(data.name)
      setPhoneNumber(data.phoneNumber)
      setAddress(data.address)
      setTownId(data.townId)
      setActive(data.active)
    }, [data])

  const fetchTowns = async () => {
    setLoading(true)
    try {
      const response = await InsuranceApi.get("/town")
      if (response.data.code === "OK" && response.data.data.length>0) {
        setTowns(response.data.data)
      } else if (response.data.code === "NOT_FOUND") {
        setTownResponse("No Towns found")
      }
    } catch (err) {
      console.error(err)
      setTownResponse("Error fetching resource, Please check your network connection")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await InsuranceApi.put(`/shop/${data.id}?name=${name}&phoneNumber=${phoneNumber}&address=${address}&active=${active}&townId=${townId}`)
      if (response.data && response.data.code === "OK") {
        setSuccess(true)
      } else {
        setFailed(true)
      }
    } catch (error) {
      setFailed(true)
      setError("An error occurred while updating the shop.")
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
          <h2 className="text-lg font-semibold">Shop Details Modification</h2>
          <p className="text-xs mb-4">Edit Details for {data.name} Shop</p>
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
          <InputField label="Name" value={name} onChange={setName} placeholder={data.name} />
          <InputField
            label="Phone Number"
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder={data.phoneNumber}
          />
          <InputField label="Address" value={address} onChange={setAddress} placeholder={data.address} />
          <SelectField
            label="Town"
            value={townId}
            onChange={setTownId}
            options={towns}
            placeholder="Select Parent Town"
            errorMessage={townResponse}
          />
          <SelectField
            label="Active Status"
            value={active.toString()}
            onChange={(value) => setActive(value === "true")}
            options={[
              { id: "true", name: "Active" },
              { id: "false", name: "Inactive" },
            ]}
          />
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

const InputField = ({ label, value, onChange, placeholder }) => (
  <div className="sm:col-span-3 flex items-center">
    <label className="block text-sm font-medium leading-6 text-gray-900 w-1/6">{label}</label>
    <div className="mt-2 flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
      />
    </div>
  </div>
)

const SelectField = ({ label, value, onChange, options, placeholder, errorMessage }) => (
  <div className="sm:col-span-3 flex items-center">
    <label className="block text-sm font-medium leading-6 text-gray-900 w-1/6">{label}</label>
    <div className="mt-2 flex-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
      >
        <option value="">{placeholder}</option>
        {options &&
          options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
      </select>
      {errorMessage && <p className="mt-1 text-xs text-red-500">{errorMessage}</p>}
    </div>
  </div>
)

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
}
