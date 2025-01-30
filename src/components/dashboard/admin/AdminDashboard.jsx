import React from 'react'
import DashboardTop from '../DashboardTop'
import PieCharts from '../PieCharts'
import WeeklyReport from '../WeeklyReport'
import MonthlySalesCharts from '../MonthlySalesCharts'

export default function AdminDashboard() {
  return (
    <>
        <DashboardTop/>
        <div className='flex w-full space-x-3 mt-3'>
            <div className="flex w-1/2">
              <PieCharts/>
            </div>
            <div className="flex w-1/2">
              {/* <WeeklyReport/> */}
              <MonthlySalesCharts/>
            </div>
        </div>
        {/* <Charts/> */}
    </>
  )
}
