import React, { useEffect, useState } from 'react';
import PolicyDetails from './PolicyDetails';
import VehicleDetails from './VehicleDetails';
import AccountDetails from './AccountDetails';
import Stepper from '../Stepper';
import { StepperContext } from '../../../context/StepperContext';
import StepperControl from '../StepperControl';
import QuotationModal from './QuotationModal';

export default function MotorInsuranceSales() {

    const [currentStep, setCurrentStep] = useState(1)
    const [policyData, setPolicyData] = useState([])
    const [userData, setUserData] = useState([])
    const [vehicleData, setVehicleData] = useState([])
    const [subscriptionMethod, setSubscriptionMethod] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const steps = [
        "Vehicle Details",
        "Client Details",
        "Policy Details",
    ]

    const displayStep = (step) => {
        switch(step) {
            case 1: 
                return <VehicleDetails/>
            case 2:
                return <AccountDetails/>
            case 3:
                return <PolicyDetails/>
            default:
                return <VehicleDetails/>
        }
    }

    const handleClick = (direction) => {
        let newStep = currentStep

        if (direction === "next") {
            // if (currentStep === 1) {
            //     submitVehicleInfo();
            // }
            // if (currentStep === 2) {
            //     submitPolicyInfo();
            // }
            if (currentStep === 3 && ((policyData.insuranceType && policyData.insuranceTerm) || policyData.LicFrequency)) {
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
                <p className="text-xs mb-4">For motor vehicle insurance processing</p>
                <div className="space-y-1">
                    <Stepper
                        steps={steps}
                        currentStep={currentStep}
                    />
                    <div className="flex-1 p-2 bg-white rounded-xs border border-gray-200 border-solid border-1">
                        <StepperContext.Provider value={{
                            policyData,
                            setPolicyData,
                            vehicleData,
                            setVehicleData,
                            userData,
                            setUserData,
                            subscriptionMethod,
                            setSubscriptionMethod
                        }}>
                            {displayStep(currentStep)}                            
                            {
                                isOpen && <QuotationModal setModal={getModal} regNum={vehicleData.vehicleRegistration}/>
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
