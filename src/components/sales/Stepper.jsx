import React, {useEffect, useState, useRef} from 'react'
export default function Stepper({steps, currentStep}) {

    const [newStep, setNewStep] = useState([])
    const stepRef = useRef()

    const updateStep = (stepNumber, steps) => {
        const newSteps = [...steps]
        let count = 0

        while(count < newSteps.length){
            if(count===stepNumber){
                newSteps[count] = {
                    ...newSteps[count],
                    highlighted: true,
                    selected: true,
                    completed: true
                }
                count++
            }
            else if(count < stepNumber){
                newSteps[count] = {
                    ...newSteps[count],
                    highlighted: false,
                    selected: true,
                    completed: true
                }
                count++
            }
            else{
                newSteps[count] = {
                    ...newSteps[count],
                    highlighted: false,
                    selected: false,
                    completed: false
                }
                count++
            }
        }
        return newSteps
    }
    useEffect(()=>{
        const stepsState = steps.map((step, index)=>
            Object.assign(
                {},
                {
                    description: step,
                    completed: false,
                    highlighted: index === 0? true: false,
                    selected: index === 0? true: false
                }
            )
        )

        stepRef.current = stepsState
        const current = updateStep(currentStep-1, stepRef.current)
        setNewStep(current)
    }, [steps, currentStep])

    const displaySteps = newStep.map((step, index)=>{
        return (
            <button
                className={`border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex ${step.selected?"bg-gray-700 text-white":""}`}
            >
                {step.description}
            </button>
        )
    }) 

    return (
        <div className="flex flex-1 space-x-2">
            {displaySteps}                 
        </div>
    )
}