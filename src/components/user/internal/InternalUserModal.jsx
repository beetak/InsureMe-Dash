import { useEffect, useState } from "react"
import Modal from "../../modal/Modal"
import InsuranceApi, { setupInterceptors } from "../../api/InsuranceApi"
import useAuth from "../../../hooks/useAuth"

export default function InternalUserModal({ setModal, data, refresh }) {

    const { user, setUser } = useAuth()

    useEffect(() => {
        setupInterceptors(() => user, setUser)
    },[])

    const [domainName, setDomainName] = useState("")
    const [role, setRole] = useState("")
    const [regionId, setRegionId] = useState("")
    const [townId, setTownId] = useState("")
    const [shopId, setShopId] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [error, setError] = useState([])
    const [shops, setShops] = useState('')
    const [towns, setTowns] = useState('')
    const [regions, setRegions] = useState('')
    const [shopResponse, setShopResponse] = useState("")
    const [townResponse, setTownResponse] = useState("")
    const [regionResponse, setRegionResponse] = useState("")

    useEffect(()=>{
        const fetchAsyncRegions = async () => {
            try {
                const response = await InsuranceApi.get('/region')
                if(response.data.code==="OK"&&response.data.data.length>0){
                    setRegions(response.data.data)
                }
                else if (response.data.code==="OK"&&response.data.data.length<1){
                    setRegionResponse("No regions found")
                }
            } catch (error) {
                setRegionResponse('Error fetching regions')
                console.error("Error fetching regions: ", error)
            }
        }
        fetchAsyncRegions()
    },[])

    const fetchTowns = async (id) => {
        try{
            const response = await InsuranceApi.get(`/town/region/${id}`)
            if(response.data.code==="OK"&&response.data.data.length>0){
                setTowns(response.data.data)
            }
            else if (response.data.code==="OK"&&response.data.data.length<1){
                setTownResponse("No towns found for this region")
            }
        }
        catch(err){
            setTownResponse("Error fetching towns")
        }
        
    }

    const fetchShops = async (id) => {
        try{
            const response = await InsuranceApi.get(`/shop/town/${id}`)
            if(response.data.code==="OK"&&response.data.data.length>0){
                setShops(response.data.data)
            }
            else if (response.data.code==="NOT_FOUND"){
                setShopResponse("No shops found for this town")
            }
        }
        catch(err){
            setShopResponse("Error fetching towns")
        }
    }

    useEffect(() => {
        if (data) {
        setDomainName(data.domainName || "")
        setRole(data.role || "")
        setRegionId(data.regionId || "")
        setTownId(data.townId || "")
        setShopId(data.shopId || "")
        }
    }, [data])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (domainName === "" || role === "") {
            setError([{ err: "empty", message: "Please provide all required fields" }])
            return
        }

        setLoading(true)
        try {
            const response = await InsuranceApi.put(``)

            if (response.success) {
                setSuccess(true)
                refresh()
            } else {
                setFailed(true)
            }
        } catch (err) {
            setFailed(true)
            setError([{ err: "submit", message: "Error submitting form. Please try again." }])
            } finally {
            setLoading(false)
            setTimeout(() => {
                setSuccess(false)
                setFailed(false)
                setError([])
            }, 3000)
        }
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
        "ADMIN",
    ]

    return (
        <Modal setModal={setModal}>
            <h2 className="text-lg font-semibold">Internal User Details</h2>
            <p className="text-xs mb-4">{data ? "Edit" : "Add"} User</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error.map((err, index) => (
                    <p key={index} className="text-red-500">
                        {err.message}
                    </p>
                ))}
                <div className="flex items-center">
                    <label htmlFor="domainName" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                        Domain Name
                    </label>
                    <div className="mt-2 flex-1">
                        <input
                        type="text"
                        id="domainName"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                        placeholder={data.email}
                        required
                        />
                    </div>
                </div>
                <div className="flex items-center">
                    <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                        User Role
                    </label>
                    <div className="mt-2 flex-1">
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            required
                        >
                        <option value="">Select User Role</option>
                        {roles.map((r) => (
                            <option key={r} value={r}>
                            {r}
                            </option>
                        ))}
                        </select>
                    </div>
                </div>
                {role &&
                (role === "SALES_AGENT" ||
                    role === "AREA_BUSINESS_MANAGER" ||
                    role === "SHOP_SUPERVISOR" ||
                    role === "BUSINESS_PERFORMANCE_SUPERVISOR" ||
                    role === "REGIONAL_ACCOUNTANT" ||
                    role === "REGIONAL_GENERAL_MANAGER") && (
                    <div className="flex items-center">
                        <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                            Region
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="regionId"
                                name="regionId"
                                value={regionId}
                                onChange={(e) => {setRegionId(Number(e.target.value));fetchTowns(e.target.value)}}
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value={0}>Select Parent Region</option>
                                {regions ? (
                                    regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.name}
                                    </option>
                                    ))
                                ) : (
                                    <option value={0} className='text-red-500'>{regionResponse}</option>
                                )}
                            </select>
                        </div>
                    </div>
                )}
                {role &&
                regionId &&
                (   
                    role === "SALES_AGENT" ||
                    role === "AREA_BUSINESS_MANAGER" ||
                    role === "BUSINESS_PERFORMANCE_SUPERVISOR" ||
                    role === "SHOP_SUPERVISOR") && (
                    <div className="flex items-center">
                        <label htmlFor="town" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                            Town
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="townId"
                                name="townId"
                                value={townId}
                                onChange={(e) => {setTownId(Number(e.target.value));fetchShops(e.target.value)}}
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value={0}>Select User Town</option>
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
                    </div>
                )}
                {role && townId && (role === "SALES_AGENT" || role === "SHOP_SUPERVISOR") && (
                    <div className="flex items-center">
                        <label htmlFor="shop" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
                        Shop
                        </label>
                        <div className="mt-2 flex-1">
                            <select
                                id="shopId"
                                name="shopId"
                                value={shopId}
                                onChange={(e) => {setShopId(Number(e.target.value));fetchAgents(e.target.value)}}
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                            >
                                <option value={0}>Select User Shop</option>
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
                )}
                <div className="flex space-x-2 pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setModal(false)}
                        className="border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40"
                    >
                        Cancel
                    </button>
                </div>
            </form>
            {success && <p className="text-green-500 mt-2">User successfully {data ? "updated" : "added"}!</p>}
            {failed && <p className="text-red-500 mt-2">Failed to {data ? "update" : "add"} user. Please try again.</p>}
        </Modal>
  )
}

