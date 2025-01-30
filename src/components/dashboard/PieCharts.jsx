import React, { useState, lazy, Suspense } from 'react';

// Lazy load the Chart component
const Chart = lazy(() => import('react-apexcharts'));

export default function PieCharts() {
    const [state, setState] = useState({
        options: {
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
        series: [55, 45],
        options1: {
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
        series1: [5, 25, 10, 15, 10, 12, 23],
    });

    return (
        <div className="flex flex-row w-full py-2 space-x-4">
            <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Monthly Sales and Commissions</h2>
                    <p className="text-sm text-gray-600">Comparison of sales and commissions over time</p>
                </div>
                <div className="p-4 flex space-x-4">
                    <div className="flex-1">
                        <Suspense fallback={<div>Loading chart...</div>}>
                            <Chart
                                options={state.options}
                                series={state.series}
                                type="donut"
                                width="100%"
                                height={250}
                            />
                        </Suspense>
                    </div>
                    <div className="flex-1">
                        <Suspense fallback={<div>Loading chart...</div>}>
                            <Chart
                                options={state.options1}
                                series={state.series1}
                                type="donut"
                                width="100%"
                                height={250}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}