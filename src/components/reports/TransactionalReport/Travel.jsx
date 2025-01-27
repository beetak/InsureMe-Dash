import React from 'react'
import { motion } from 'framer-motion'

export default function Travel({sales}) {

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-").map(Number)
        const date = new Date(year, month - 1, day)
      
        const options = { day: "numeric", month: "short", year: "numeric" }
        return new Intl.DateTimeFormat("en-US", options).format(date)
      }
      
      

    return (
        <>
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex w-full space-x-6"
                >
                    <div className="bg-white rounded-xl shadow-md overflow-hidden md:w-1/2">
                        <div className="flex flex-col">
                            <div className="bg-main-color text-white border-b-2 border-main-color py-3 px-6">
                                <span className="font-semibold">Client Details</span>
                            </div>
                            <div className="py-4">
                                <div className="space-y-4">
                                    <div className="flex-col w-full py-1 px-6 text-sm">
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Fullname: </span>{sales.transactionDescription.user.fullName}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Age: </span>{sales.transactionDescription.user.age}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Passport Number: </span><span className='uppercase'>{sales.transactionDescription.user.passportNumber}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Phone Number: </span>{sales.transactionDescription.user.phone}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Email: </span>{sales.transactionDescription.user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden md:w-1/2">
                        <div className="flex flex-col">
                            <div className=" bg-main-color text-white border-b-2 border-main-cbg-main-color py-3 px-6">
                                <span className="font-semibold">Travel Details</span>
                            </div>
                            <div className="px-6 py-4">
                                <div className="space-y-4">
                                    <div className="flex-col w-full text-sm">
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Dest Country: </span>{sales.transactionDescription.travelDetails.destination}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Res Country: </span>{sales.transactionDescription.travelDetails.residence}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Start Date: </span>{formatDate(sales.transactionDescription.travelDetails.startDate)}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">End Date: </span>{formatDate(sales.transactionDescription.travelDetails.endDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                {
                    sales.transactionDescription.traveler && sales.transactionDescription.traveler.length > 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            <div className="flex flex-col">
                                <div className=" bg-main-color text-white border-b-2 border-main-color py-3 px-6">
                                        <span className="font-semibold">Additional Travelers</span>
                                </div>
                                <div className="px-6 py-4">
                                    <div className='overflow-auto rounded:xl shadow-md'>
                                        <div className="w-full border-main-color border-2 rounded-md overflow-hidden">
                                            <div className="bg-gray-100 border-b-2 border-gray-300 flex">
                                                <div className="flex-1 px-3 py-1">Traveler's Name</div>
                                                <div className="flex-1 px-3 py-1">Passport Number</div>
                                                <div className="flex-1 px-3 py-1">Age</div>
                                            </div>
                                            <div>
                                                {
                                                    sales.transactionDescription.traveler.map((traveler, index) => (
                                                        <div key={index} className='flex py-1 border-b border-gray-300'>
                                                            <div className="flex-1 px-3">{traveler.fullName}</div>
                                                            <div className="flex-1 px-3 uppercase">{traveler.passportNumber}</div>
                                                            <div className="flex-1 px-3">{traveler.age}</div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </div>
        </>
    )
}
