import { lazy, Suspense, useEffect, useState } from "react"
import InsuranceApi, { setupInterceptors } from "../api/InsuranceApi"
import useAuth from "../../hooks/useAuth"

// Lazy load the Chart component
const Chart = lazy(() => import("react-apexcharts"))

export default function MonthlySalesCharts() {
  const { user, setUser } = useAuth()
  const [salesStats, setSalesStats] = useState({})

  useEffect(() => {
    setupInterceptors(() => user, setUser)

    const fetchSalesStats = async () => {
      try {
        const response = await InsuranceApi.get(
          `/product-payments/total-sales/categories/month-range?startMonth=1&endMonth=2`,
        )
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

  const createAreaSeries = (data) => {
    const months = ["JANUARY", "FEBRUARY"]
    const products = ["FUNERAL", "MOTOR_VEHICLE", "PROPERTY", "HEALTH", "TRAVEL"]

    const zwgSeries = {
      name: "ZWG Sales",
      data: months.map((month) => products.reduce((sum, product) => sum + (data[product]?.[month]?.ZWG || 0), 0)),
    }

    const usdSeries = {
      name: "USD Sales",
      data: months.map((month) => products.reduce((sum, product) => sum + (data[product]?.[month]?.USD || 0), 0)),
    }

    return [zwgSeries, usdSeries]
  }

  const areaSeries = createAreaSeries(salesStats)

  const areaOptions = {
    chart: {
      id: "area-chart",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ["Jan", "Feb"],
    },
    yaxis: {
      title: {
        text: "Amount",
      },
    },
    colors: ["#3B82F6", "#10B981"],
    stroke: {
      curve: "smooth",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
  }

  return (
    <div className="flex flex-row w-full py-2 space-x-4">
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Monthly Sales by Currency</h2>
          <p className="text-sm text-gray-600">Comparison of ZWG and USD sales over time</p>
        </div>
        <div className="p-4">
          <Suspense fallback={<div>Loading chart...</div>}>
            <Chart options={areaOptions} series={areaSeries} type="area" width="100%" height={250} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

