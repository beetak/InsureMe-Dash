import React from 'react'

export default function StepperControl({handleClick, steps, currentStep}) {
    return (
        <div className="flex flex-1 pt-2">
            <button
                onClick={()=>handleClick()}
                className={`border border-gray-300 bg-gray-700 text-gray-100 rounded-sm px-4 py-2 w-40 ${currentStep===1?"opacity-50 hidden":""}`}
            >
                Previous
            </button> 
            
            <button
                onClick={()=>handleClick("next")}
                className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 w-40`}
            >
                 {currentStep === steps.length ? "Quote" : "Next"}
            </button>
        </div>
    )
}
