import React from 'react'

export default function StepperTab() {
    return (
        <div className="flex flex-1 space-x-2">
            <button
                className={`border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex`}
            >
                Client Details
            </button>
            <button
                className={`border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex`}
            >
                Property Details
            </button>
        </div>
    )
}
