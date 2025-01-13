import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'

export default function PieCharts() {

    const [state, setState] = useState({
        options : {
            chart: {
              type: 'pie',
            },
            legend: {
                show: true,
                position: 'bottom',
                horizontalAlign: 'center',
            },
            labels: ['Life', 'Motor', 'Travel', 'Business', 'Livestock', 'Health', 'Property'],
        },    
        series : [5, 35, 10, 15, 10, 12, 13],
        options1: {
            chart: {
              type: 'donut',
            },
            labels: ['Sales', 'Commission'],
            legend: {
                show: true,
                position: 'bottom',
                horizontalAlign: 'center',
            },
        },
        series1: [55, 45],
        options2: {
            chart: {
              type: 'donut',
            },
            labels: ['Life', 'Motor', 'Travel', 'Business', 'Livestock', 'Health', 'Property'],            
            fill: {
                type: 'gradient',
            },
            legend: {
                show: true,
                position: 'bottom',
                horizontalAlign: 'center',
            },
        },
        series2: [5, 25, 10, 15, 10, 12, 23],

    })

    return (
        <div className='flex flex-col p-2'>
            <h1>Pie Charts</h1>
            <div className='flex w-full justify-around bg-white rounded-md'>
                <ReactApexChart options={state.options1} series={state.series1} type="donut" width="100%" height="400px" />
                <ReactApexChart options={state.options2} series={state.series2} type="donut" width="100%" height="400px" />
                <ReactApexChart options={state.options} series={state.series} type="pie" width="100%" height="400px" />
            </div>
        </div>
    )
}
