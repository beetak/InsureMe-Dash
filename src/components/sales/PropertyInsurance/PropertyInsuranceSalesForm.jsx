import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAsyncPolicy, getPolicies } from '../../../store/policy-store';
import { getVehicleInformation, postVehicleInfo } from '../../../store/payments-store';
import PropertyDetails from './PropertyDetails';
import StepperControl from '../StepperControl';
import Stepper from '../Stepper';
import UserDetails from './UserDetails';
import { StepperContext } from '../../../context/StepperContext';
import AccountDetails from './AccountDetails';

export default function PropertyInsuranceSales() {

    const [currentStep, setCurrentStep] = useState(1)
    const [userData, setUserData] = useState([])
    const [propertyData, setPropertyData] = useState([])

    const dispatch = useDispatch();
    const vehicleInfo = useSelector(getVehicleInformation)

    useEffect(() => {
        dispatch(fetchAsyncPolicy());
    }, []);

    const steps = [
        "Client's Details",
        "Property Details",
    ]

    const displayStep = (step) => {
        switch(step) {
            case 1: 
                return <AccountDetails/>
            case 2:
                return <PropertyDetails/>
            default:
                return <AccountDetails/>
        }
    }

    const handleClick = (direction) => {
        let newStep = currentStep

        direction === "next" ? newStep ++ : newStep--

        newStep > 0 && newStep <= steps.length && setCurrentStep(newStep)
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
                            propertyData,
                            setPropertyData
                        }}>
                            {displayStep(currentStep)}
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
