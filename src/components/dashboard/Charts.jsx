import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import Chart from 'react-apexcharts'

export default function Charts() {
    const [state, setState] = useState({
        options: {
            chart: {
                id: 'basic-bar'
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
            }
        },
        pieOptions: {
            chart: {
                type: 'pie',
            },
            labels: ['Apple', 'Banana', 'Orange'],
        },
        series: [
            {
              name: 'First Mutual',
              data: [30, 40, 45, 50, 49],
            },
            {
              name: 'Nicoz Diamond',
              data: [40, 40, 85, 59, 90],
            },
        ],
        pieSeries : [20, 30, 50]
    })
    return (
        <div className='flex w-full space-x-3'>
            <Chart
                options={state.options}
                series={state.series}
                type='bar'
                width='400'
            />
            <Chart
                options={state.options}
                series={state.series}
                type='area'
                width='400'
            />
            <ReactApexChart options={state.pieOptions} series={state.pieSeries} type="pie" width="100%" />
        </div>
    )
}
