"use client"

import { useState, lazy, Suspense, useEffect } from "react"
import useAuth from "../../hooks/useAuth"
import InsuranceApi, { setupInterceptors } from "../api/InsuranceApi"

// Lazy load the Chart component
const Chart = lazy(() => import("react-apexcharts"))

export default function PieCharts() {
  const { user, setUser } = useAuth()
  const [salesStats, setSalesStats] = useState({})
  const [chartOptions, setChartOptions] = useState({
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
    tooltip: {
      y: {
        formatter: (value) => value.toFixed(2),
      },
    },
    // Show all labels in legend even if value is 0
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
          },
        },
      },
    },
  })
  const [chartSeries, setChartSeries] = useState([])

  useEffect(() => {
    setupInterceptors(() => user, setUser)

    const fetchSalesStats = async () => {
      try {
        const response = await InsuranceApi.get(`/product-payments/total-sales/categories/current-month`)
        if (response.data.data) {
          console.log("response", response.data.data)
          setSalesStats(response.data.data)

          // Process chart data
          const data = response.data.data

          // Include all categories, even those with zero values
          const allData = Object.entries(data)

          const labels = allData.map(([label]) => label)
          const series = allData.map(([_, values]) => {
            const zwgAmount = Number.parseFloat(values.ZWG) || 0
            const usdAmount = Number.parseFloat(values.USD) || 0
            return Number.parseFloat((zwgAmount + usdAmount).toFixed(2))
          })

          console.log("Chart labels:", labels)
          console.log("Chart series:", series)

          // Log which categories have non-zero values (for debugging)
          const nonZeroCategories = labels.filter((_, index) => series[index] > 0)
          console.log("Categories with values > 0:", nonZeroCategories)

          setChartOptions((prev) => ({
            ...prev,
            labels: labels,
          }))
          setChartSeries(series)
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchSalesStats()
  }, [user, setUser])

  return (
    <div className="flex flex-row w-full py-2 space-x-4">
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Monthly Sales by Policy</h2>
          <p className="text-sm text-gray-600">Distribution of sales across different insurance policies</p>
        </div>
        <div className="p-4 flex space-x-4">
          <div className="flex-1">
            <Suspense fallback={<div>Loading chart...</div>}>
              {chartSeries.length > 0 && (
                <Chart options={chartOptions} series={chartSeries} type="donut" width="100%" height={250} />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}