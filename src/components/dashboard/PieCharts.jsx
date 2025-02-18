"use client"

import { useState, lazy, Suspense, useEffect } from "react"
import useAuth from "../../hooks/useAuth"
import InsuranceApi, { setupInterceptors } from "../api/InsuranceApi"

// Lazy load the Chart component
const Chart = lazy(() => import("react-apexcharts"))

export default function PieCharts() {
  const { user, setUser } = useAuth()
  const [salesStats, setSalesStats] = useState({})

  const [state, setState] = useState({
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Sales", "Commission"],
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
      },
    },
    series: [55, 45],
    options1: {
      chart: {
        type: "donut",
      },
      labels: [],
      fill: {
        type: "gradient",
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
      },
    },
    series1: [],
  })

  useEffect(() => {
    setupInterceptors(() => user, setUser)
    const fetchSalesStats = async () => {
      try {
        const response = await InsuranceApi.get(`/product-payments/total-sales/categories/current-month`)
        if (response.data.data) {
          console.log("response", response.data.data)
          setSalesStats(response.data.data)
          updateChartData(response.data.data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchSalesStats()
  }, [user, setUser])

  const updateChartData = (data) => {
    const labels = Object.keys(data)
    const series = labels.map((label) => {
      const zwgAmount = Number.parseFloat(data[label].ZWG) || 0
      const usdAmount = Number.parseFloat(data[label].USD) || 0
      return zwgAmount + usdAmount
    })

    setState((prevState) => ({
      ...prevState,
      options1: {
        ...prevState.options1,
        labels: labels,
      },
      series1: series,
    }))
  }

  return (
    <div className="flex flex-row w-full py-2 space-x-4">
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Monthly Sales by Category</h2>
          <p className="text-sm text-gray-600">Distribution of sales across different insurance categories</p>
        </div>
        <div className="p-4 flex space-x-4">
          <div className="flex-1">
            <Suspense fallback={<div>Loading chart...</div>}>
              <Chart options={state.options} series={state.series} type="donut" width="100%" height={250} />
            </Suspense>
          </div>
          <div className="flex-1">
            <Suspense fallback={<div>Loading chart...</div>}>
              <Chart options={state.options1} series={state.series1} type="donut" width="100%" height={250} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

