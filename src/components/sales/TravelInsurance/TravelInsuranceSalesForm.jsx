import React, { useEffect, useState } from 'react';
import Stepper from '../Stepper';
import { StepperContext } from '../../../context/StepperContext';
import StepperControl from '../StepperControl';
import TravelDetails from './TravelDetails';
import AccountDetails from './AccountDetails';
import QuotationModal from './QuotationModal';

export default function TravelInsuranceSales() {

    const [currentStep, setCurrentStep] = useState(1)
    const [userData, setUserData] = useState([])
    const [travelData, setTravelData] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    const steps = [
        "Client's Details",
        "Travel Details"
    ]

    const displayStep = (step) => {
        switch(step) {
            case 1: 
                return <AccountDetails/>
            case 2:
                return <TravelDetails/>
            default:
                return <AccountDetails/>
        }
    }

    const handleClick = (direction) => {
        let newStep = currentStep

        if (direction === "next") {
            // if (currentStep === 1) {
            //     submitUserInfo();
            // }
            if (currentStep === 2) {
                setIsOpen(true);
            }
            newStep++;
        } else {
            newStep--;
        }    

        newStep > 0 && newStep <= steps.length && setCurrentStep(newStep)
    }

    const getModal =(isOpen)=>{
        setIsOpen(isOpen)
    }

    return (
        <>
        <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
            <h2 className="text-lg font-semibold">Policy Sale</h2>
            <p className="text-xs mb-4">For travel insurance processing</p>
            <div className="space-y-1">
                    <Stepper
                        steps={steps}
                        currentStep={currentStep}
                    />
                    <div className="flex-1 p-2 bg-white rounded-xs border border-gray-200 border-solid border-1">
                        <StepperContext.Provider value={{
                            userData,
                            setUserData,
                            travelData,
                            setTravelData
                        }}>
                            {displayStep(currentStep)}
                            {
                                isOpen && <QuotationModal setModal={getModal}/>
                            }
                        </StepperContext.Provider>
                    </div>
                </div>
                <StepperControl
                    handleClick={handleClick}
                    currentStep={currentStep}
                    steps={steps}
                />
            </div>
        </>
    )
}
