import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navActions } from '../../../store/nav-store';
import { fetchAsyncPolicy, getPolicies } from '../../../store/policy-store';
import { fetchAsyncQuotation } from '../../../store/sales-store';
import VehicleDetails from './UserDetails';
import { carApiLogin, fetchAsyncCarModels } from '../../../store/carmodel-store';
import { getVehicleInformation, postVehicleInfo } from '../../../store/payments-store';
import PropertyDetails from './PropertyDetails';

export default function PropertyInsuranceSales() {

    const [activeStep, setActiveStep] = useState(1);
    const [vehicleClass, setVehicleClass] = useState('');
    const [zbcCategory, setZbcCategory] = useState('');
    const [zbcTerm, setZbcTerm] = useState('');
    const [zinaraTerm, setZinaraTerm] = useState('');
    const [insuranceType, setInsuranceType] = useState('');
    const [insuranceTerm, setInsuranceTerm] = useState('');
    const [vehicleMake, setVehicleMake] = useState()
    const [vehicleColor, setVehicleColor] = useState()
    const [vehicleModel, setVehicleModel] = useState()
    const [vehicleType, setVehicleType] = useState()
    const [engineNumber, setEngineNumber] = useState()
    const [vehicleUsage, setVehicleUsage] = useState()
    const [registrationNumber, setRegistrationNumber] = useState()
    const [yearOfManufacture, setYearOfManufacture] = useState()
    const [registrationYear, setRegistrationYear] = useState()

    const dispatch = useDispatch();
    const vehicleInfo = useSelector(getVehicleInformation)

    useEffect(() => {
        dispatch(fetchAsyncPolicy());
        dispatch(carApiLogin({
            api_token: "77410bc5-bc9c-464c-8b88-da5d25c03474",
            api_secret: "f9691402cd8abd80de17badeeffef23c"
        })).then((response)=>{
            if(response.payload.success){
                dispatch(fetchAsyncCarModels({token: response.payload.data}))
                .then((res)=>{
                    console.log("car fetch: ", res)
                })
            }
        })
    }, []);

    const policies = useSelector(getPolicies);

    const handleNextStep = () => {
        if (activeStep < 3) {
        setActiveStep(activeStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (activeStep > 1) {
        setActiveStep(activeStep - 1);
        }
    };

    const [policyDetails, setPolicyDetails] = useState({
        zbcCategory,
        vehicleClass,
        zbcTerm,
        zinaraTerm,
        insuranceType,
        insuranceTerm,
    });

    const [vehicleDetails, setVehicleDetails] = useState({
        vehicleMake,
        vehicleModel,
        vehicleColor,
        vehicleType,
        engineNumber,
        vehicleUsage,
        registrationNumber,
        yearOfManufacture,
        registrationYear
    });
    
    const handlePolicyDetailsChange = (newPolicyDetails) => {
        setPolicyDetails(newPolicyDetails);
    };
    
    const handleVehicleDetailsChange = (newVehicleDetails) => {
        setVehicleDetails(newVehicleDetails);
    };

    const submitVehicleInfo = (e) => {
        e.preventDefault();
        if(vehicleInfo){
            handleNextStep()
        }
        else{
            dispatch(
                postVehicleInfo({
                    ...vehicleDetails
                })
            ).then((response) => {
                console.log('Response: ', response.payload);
                if (response.payload && response.payload.success) {
                    handleNextStep()
                }
            }).catch((err)=>{
                console.log("err", err)
            })
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(
        fetchAsyncQuotation({
            zbcCategory: policyDetails.zbcCategory,
            vehicleClass: policyDetails.vehicleClass,
            zbcTerm: policyDetails.zbcTerm,
            zinaraTerm: policyDetails.zinaraTerm,
            insuranceType: policyDetails.insuranceType,
            insuranceTerm: policyDetails.insuranceTerm,
        })
        ).then((response) => {
            if (response.payload && response.payload.success) {
                dispatch(navActions.toggleQuote(true));
            }
        });
    };

    return (
        <>
        <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
            <h2 className="text-lg font-semibold">Policy Sale</h2>
            <p className="text-xs mb-4">For travel insurance processing</p>
            <div className="space-y-1">
                <div className="flex flex-1 space-x-2">
                    <button
                        className={`border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex ${
                            activeStep === 1 ? 'bg-gray-700 text-white' : ''
                        }`}
                        onClick={() => setActiveStep(1)}
                    >
                        Client Details
                    </button>
                    {/* <button
                        className={`border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex ${
                            activeStep === 2 ? 'bg-gray-700 text-white' : ''
                        }`}
                        onClick={() => setActiveStep(2)}
                    >
                        Account Details
                    </button> */}
                    <button
                        className={`border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex ${
                            activeStep === 2 ? 'bg-gray-700 text-white' : ''
                        }`}
                        onClick={() => setActiveStep(2)}
                    >
                        Property Details
                    </button>
                </div>
                <div className="flex-1">
                    {/* Tab content */}
                    <div>
                        {/* Step 1 content */}
                        {activeStep === 1 && (
                            <div className="p-2 bg-white rounded-xs border border-gray-200 border-solid border-1">
                                <VehicleDetails onChange={handleVehicleDetailsChange}/>                   
                            </div>
                        )}
                        {/* Step 2 content */}
                        {/* {activeStep === 2 && (
                            <div className="p-2 bg-white rounded-xs border border-gray-200 border-solid border-1">
                                <AccountDetails />
                            </div>
                        )} */}
                        {/* Step 3 content */}
                        {activeStep === 2 && (
                            <div className="p-2 bg-white rounded-xs border border-gray-200 border-solid border-1">
                                <PropertyDetails onChange={handlePolicyDetailsChange}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex space-x-2 pt-2">
                {activeStep === 1 && (
                    <button
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 w-40`}
                        onClick={submitVehicleInfo}
                    >
                        Next
                    </button>
                )}
                {/* {activeStep === 2 && (
                    <>
                        <button
                            className={`border border-gray-300 bg-gray-700 text-gray-100 rounded-sm px-4 py-2 w-40`}
                            onClick={handlePreviousStep}
                        >
                            Previous
                        </button>                       
                        <button
                            className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 w-40`}
                            onClick={handleNextStep}
                        >
                            Next
                        </button>
                    </>
                )} */}
                {activeStep === 2 && (
                    <>
                        <button
                            className={`border border-gray-300 bg-gray-700 text-gray-100 rounded-sm px-4 py-2 w-40`}
                            onClick={handlePreviousStep}
                        >
                            Previous
                        </button>                        
                        <button
                            className={`border border-gray-300 bg-blue-500 text-gray-100 rounded-sm px-2 py-2 w-64`}
                            onClick={handleSubmit}
                        >
                            Request Quotation
                        </button>
                    </>
                )}
                </div>
            {/* <div className="flex space-x-2 pt-2">
                {activeStep > 1 && (
                    <button
                    className={`border border-gray-300 bg-gray-700 text-gray-100 rounded-sm px-4 py-2 w-40`}
                    onClick={handlePreviousStep}
                    >
                    Previous
                    </button>
                )}
                {activeStep < 3 && (
                    <button
                        className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 w-40`}
                        onClick={handleNextStep}
                    >
                    Next
                    </button>
                )}
                {activeStep === 3 && (
                    <button
                        className={`border border-gray-300 bg-blue-500 text-gray-100 rounded-sm px-2 py-2 w-64`}
                        onClick={handleSubmit}
                    >
                        Request Quotation
                    </button>
                )}
                </div> */}
            </div>
        </>
    )
}
