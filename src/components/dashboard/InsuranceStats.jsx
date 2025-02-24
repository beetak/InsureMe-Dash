"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useAuth from "../../hooks/useAuth"
import InsuranceApi, { setupInterceptors } from "../api/InsuranceApi"

export default function InsuranceStats() {
  const { user, setUser } = useAuth()

  const [dailySales, setDailySales] = useState({
    vehicle: { count: 0, ZWG: 0, USD: 0 },
    other: { count: 0, ZWG: 0, USD: 0 },
  })
  const [monthlySales, setMonthlySales] = useState({
    vehicle: { count: 0, ZWG: 0, USD: 0 },
    other: { count: 0, ZWG: 0, USD: 0 },
  })
  const [showUSD, setShowUSD] = useState(false)

  useEffect(() => {
    setupInterceptors(() => user, setUser)
    getDailySales()
    getMonthlySales()
  }, [user, setUser])

  const aggregateSalesData = (data) => {
    let vehicleCount = 0
    let vehicleZWG = 0
    let vehicleUSD = 0
    let otherCount = 0
    let otherZWG = 0
    let otherUSD = 0

    data.forEach((item) => {
      if (item.insuranceCategory === "MOTOR_VEHICLE") {
        vehicleCount += item.totalCount
        vehicleZWG += item.amounts.ZWG
        vehicleUSD += item.amounts.USD || 0
      } else {
        otherCount += item.totalCount
        otherZWG += item.amounts.ZWG
        otherUSD += item.amounts.USD || 0
      }
    })

    return {
      vehicle: { count: vehicleCount, ZWG: vehicleZWG, USD: vehicleUSD },
      other: { count: otherCount, ZWG: otherZWG, USD: otherUSD },
    }
  }

  const getDailySales = async () => {
    const transactionDate = new Date()
    const formattedStartDate = new Date(transactionDate).toISOString().slice(0, 10)
    const formattedEndDate = new Date(transactionDate).toISOString().slice(0, 10)
    const response = await InsuranceApi.get(
      `/product-payments/by-insurer/${user.companyId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
    )

    if (response.data.code === "OK") {
      const aggregatedData = aggregateSalesData(response.data.data)
      setDailySales(aggregatedData)
    }
  }

  const getMonthlySales = async () => {
    const now = new Date()
    const startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
    const formattedStartDate = startDate.toISOString().slice(0, 10)
    const endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0))
    const formattedEndDate = endDate.toISOString().slice(0, 10)
    const response = await InsuranceApi.get(
      `/product-payments/by-insurer/${user.companyId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
    )

    if (response.data.code === "OK") {
      const aggregatedData = aggregateSalesData(response.data.data)
      setMonthlySales(aggregatedData)
    }
  }

  return (
    <>
      <div className="flex w-full space-x-3">
        <div className="flex flex-1">
          <div className="flex-col flex w-full">
            <div className="flex justify-around bg-gradient-to-r from-[#656E70] to-main-color w-full rounded-md h-40 items-center">
              <div className="flex flex-col py-4 space-y-4 items-center w-[28%]">
                <h1 className="text-white text-sm font-bold">Vehicle Insurance</h1>
                <h1 className="text-4xl text-bold text-white">
                  <i className="fa fa-car" />
                </h1>
                <div className="flex w-full text-white justify-around">
                  <p className="flex flex-col text-xs">
                    Vehicles<span className="text-lg">{monthlySales.vehicle.count}</span>
                  </p>
                  <p className="flex flex-col text-xs">
                    Premium
                    <span className="text-lg">
                      {showUSD ? monthlySales.vehicle.USD.toFixed(2) : monthlySales.vehicle.ZWG.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="w-[1px] bg-white h-16 m-0 bg-gradient-to-b from-[#656E70] to-[rgba(255,255,255,1)]" />
              <div className="flex flex-col py-4 space-y-4 items-center w-[28%]">
                <h1 className="text-white text-sm font-bold">Other Insurance</h1>
                <h1 className="text-4xl text-bold text-white">
                  <i className="fa-solid fa-shield-halved"></i>
                </h1>
                <div className="flex w-full text-white justify-around">
                  <p className="flex flex-col text-xs">
                    Number<span className="text-lg">{monthlySales.other.count}</span>
                  </p>
                  <p className="flex flex-col text-xs">
                    Premium
                    <span className="text-lg">
                      {showUSD ? monthlySales.other.USD.toFixed(2) : monthlySales.other.ZWG.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="w-[1px] bg-white h-16 m-0 bg-gradient-to-b from-[#656E70] to-[rgba(255,255,255,1)]" />
              <div className="flex flex-col py-4 space-y-4 items-center w-[38%]">
                <h1 className="text-white text-sm font-bold">
                  <span className="fas fa-user mr-2" />
                  Daily Stats
                </h1>
                <div className="flex w-full">
                  <div className="flex flex-col px-4 space-y-4 w-1/2">
                    <h1 className="text-xs text-bold text-white">
                      <i className="fa fa-car text-lg mr-4" />
                      Vehicle Insurance
                    </h1>
                    <div className="flex w-full text-white justify-between">
                      <p className="flex flex-col">
                        {dailySales.vehicle.count}
                        <span className="text-xs">
                          {!showUSD && 'ZWG '+dailySales.vehicle.ZWG.toFixed(2)}
                          {showUSD && 'USD '+dailySales.vehicle.USD.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col px-4 space-y-4 w-1/2">
                    <h1 className="text-xs text-bold text-white">
                      <i className="fa-solid fa-shield-halved text-lg mr-4" />
                      Other Insurance
                    </h1>
                    <div className="flex w-full text-white justify-between">
                      <p className="flex flex-col">
                        {dailySales.other.count}
                        <span className="text-xs">
                          {!showUSD && 'ZWG '+dailySales.other.ZWG.toFixed(2)}
                          {showUSD && 'USD '+dailySales.other.USD.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Currency Toggle Button */}
            <div className="relative flex justify-center mt-4">
              <div className="relative bg-gray-100 rounded-full p-1 shadow-lg w-64">
                <div className="relative z-10 flex justify-between">
                  <motion.button
                    className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                      !showUSD ? "text-white" : "text-gray-500"
                    }`}
                    onClick={() => setShowUSD(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ZWG
                  </motion.button>
                  <motion.button
                    className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                      showUSD ? "text-white" : "text-gray-500"
                    }`}
                    onClick={() => setShowUSD(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    USD
                  </motion.button>
                </div>
                <motion.div
                  className="absolute inset-0 w-1/2 h-full bg-main-color rounded-full"
                  initial={false}
                  animate={{
                    x: showUSD ? "100%" : "0%",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 1,
                  }}
                  style={{
                    transform: `translateX(${showUSD ? "100%" : "0%"})`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-80">
          <div className="flex flex-col p-2 space-y-2 items-center bg-gray-400 w-full rounded-md">
            <div className="rounded-full overflow-hidden mt-8 h-36 w-36">
              <img src="images/user.png" className="w-96 bg-gradient-to-b from-main-color to-secondary-color" alt="" />
            </div>
            <h1 className="text-white text-xl">
              {user.firstname} {user.surname}
            </h1>
            <h1 className="text-xs text-bold text-white">{user.role}</h1>
          </div>
        </div>
      </div>
    </>
  )
}