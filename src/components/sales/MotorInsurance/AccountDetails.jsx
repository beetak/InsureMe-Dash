import React, { useContext } from 'react';
import { StepperContext } from '../../../context/StepperContext';
import { formatNationalId } from '../utils/formatNationalId';

export default function AccountDetails() {
    const { userData, setUserData } = useContext(StepperContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'idNumber') {
            const formattedValue = formatNationalId(value);
            setUserData((prevData) => ({
                ...prevData,
                [name]: formattedValue,
            }));
        } else {
            setUserData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    return (
        <>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Fullname
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="text"
                        name="fullname"
                        id="fullname"
                        autoComplete="name"
                        placeholder='Fullname'
                        onChange={handleChange}
                        value={userData["fullname"] || ""}
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="idNumber" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    National Identity Number
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="text"
                        name="idNumber"
                        id="idNumber"
                        autoComplete="off"
                        placeholder='Id Number'
                        onChange={handleChange}
                        value={userData["idNumber"] || ""}
                        maxLength={17}
                        className="uppercase block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Phone Number
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        autoComplete="tel"
                        placeholder='Phone Number'
                        onChange={handleChange}
                        value={userData["phoneNumber"] || ""}
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="sm:col-span-3 flex items-center">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                    Email Address
                </label>
                <div className="mt-2 flex-1">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="email"
                        placeholder='Email Address'
                        onChange={handleChange}
                        value={userData["email"] || ""}
                        className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
        </>
    );
}

