import React, { lazy, Suspense } from 'react'

// Lazy load the Chart component
const Chart = lazy(() => import('react-apexcharts'))

export default function SalesCharts() {
  const barOptions = {
    chart: {
      id: 'basic-bar',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ['Jan']
    },
    yaxis: {
      title: {
        text: 'Sales'
      }
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
  }

  const barSeries = [
    {
      name: 'First Mutual',
      data: [30],
    },
    {
      name: 'Nicoz Diamond',
      data: [50],
    },
    {
      name: 'Old Mutual',
      data: [40],
    },
    {
      name: 'Credsure',
      data: [75],
    },
    {
      name: 'Nicoz Diamond',
      data: [35],
    },
  ]

  const areaOptions = {
    chart: {
      id: 'area-chart',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yaxis: {
      title: {
        text: 'Amount'
      }
    },
    colors: ['#3B82F6', '#10B981'],
    stroke: {
      curve: 'smooth'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    }
  }

  const areaSeries = [
    {
      name: 'Sales',
      data: [30, 15, 25, 60, 25, 55],
    },
    {
      name: 'Commissions',
      data: [10, 5, 8, 20, 8, 18],
    },
  ]

  return (
    <div className="flex flex-row w-full py-2 space-x-4">
      <div className="w-1/2 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Company Sales Comparison</h2>
          <p className="text-sm text-gray-600">Monthly sales data for different companies</p>
        </div>
        <div className="p-4">
          <Suspense fallback={<div>Loading chart...</div>}>
            <Chart
              options={barOptions}
              series={barSeries}
              type="bar"
              width="100%"
              height={300}
            />
          </Suspense>
        </div>
      </div>

      <div className="w-1/2 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Monthly Sales and Commissions</h2>
          <p className="text-sm text-gray-600">Comparison of sales and commissions over time</p>
        </div>
        <div className="p-4">
          <Suspense fallback={<div>Loading chart...</div>}>
            <Chart
              options={areaOptions}
              series={areaSeries}
              type="area"
              width="100%"
              height={300}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

