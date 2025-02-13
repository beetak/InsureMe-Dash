"use client"

import { lazy, Suspense, useEffect, useState } from "react"
import useAuth from "../../hooks/useAuth"
import InsuranceApi, { setupInterceptors } from "../api/InsuranceApi"

// Lazy load the Chart component
const Chart = lazy(() => import("react-apexcharts"))

export default function SalesCharts() {
  const { user, setUser } = useAuth()
  const [salesStats, setSalesStats] = useState([])
  const [selectedCurrency, setSelectedCurrency] = useState("ZWG")

  useEffect(() => {
    setupInterceptors(() => user, setUser)

    const fetchSalesStats = async () => {
      try {
        const response = await InsuranceApi.get(`/product-payments/total-sales`)
        if (response.data.data) {
          console.log("response", response.data.data)
          setSalesStats(response.data.data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchSalesStats()
  }, [user, setUser])

  const barOptions = {
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40px",
        endingShape: "rounded",
      },
    },
    xaxis: {
      categories: ["Sales"],
    },
    yaxis: {
      title: {
        text: `Sales (${selectedCurrency})`,
      },
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
  }

  const createBarSeries = (data, currency) => {
    return data.map((item) => ({
      name: item.insurerName,
      data: [item.totalSales[currency] || 0],
    }))
  }

  const barSeries = createBarSeries(salesStats, selectedCurrency)

  const toggleCurrency = () => {
    setSelectedCurrency((prev) => (prev === "ZWG" ? "USD" : "ZWG"))
  }

  return (
    <div className="flex flex-col w-full py-2 space-y-4">
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Company Sales Comparison</h2>
            <p className="text-sm text-gray-600">Monthly sales data for different companies</p>
          </div>
          <button
              onClick={toggleCurrency}
              className="px-4 py-1 border border-blue-500 text-blue-500 rounded-full transition-colors duration-300 hover:bg-blue-500 hover:text-white"
            >
            Toggle to {selectedCurrency === "ZWG" ? "USD" : "ZWG"}
          </button>
        </div>
        <div className="p-4">
          <Suspense fallback={<div>Loading chart...</div>}>
            <Chart options={barOptions} series={barSeries} type="bar" width="100%" height={250} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

