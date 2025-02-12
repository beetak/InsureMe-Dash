import React, { lazy, Suspense, useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import InsuranceApi, { setupInterceptors } from '../api/InsuranceApi'

// Lazy load the Chart component
const Chart = lazy(() => import('react-apexcharts'))

export default function SalesCharts() {

  const { user, setUser } = useAuth()

  const [ salesStats, setSalesStats ] = useState([])

  useEffect(()=>{
    setupInterceptors(()=> user, setUser)

    const fetchSalesStats = async () => {
      try{
        const response = await InsuranceApi.get(`/product-payments/total-sales`)
        if(response.data.data){
          console.log("response", response)
          setSalesStats(response.data.data)
        }
      }
      catch(err){
        console.log(err)
      }
    }
    fetchSalesStats()
  },[])

  const barOptions = {
    chart: {
      id: 'basic-bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40px', // Set the width of the bars
        endingShape: 'rounded' // Optional: makes the ends of the bars rounded
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

  const createBarSeries = (response) => {
    return response.map(item => ({
        name: item.insurerName,
        data: [item.totalSales],
    }));
  };

  const barSeries = createBarSeries(salesStats);
  
  // const barSeries = [
  //   {
  //     name: 'First Mutual',
  //     data: [30],
  //   },
  //   {
  //     name: 'Nicoz Diamond',
  //     data: [50],
  //   },
  //   {
  //     name: 'Old Mutual',
  //     data: [40],
  //   },
  //   {
  //     name: 'Credsure',
  //     data: [75],
  //   },
  //   {
  //     name: 'Nicoz Diamond',
  //     data: [35],
  //   },
  // ]

  return (
    <div className="flex flex-row w-full py-2 space-x-4">
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
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
              height={250}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

