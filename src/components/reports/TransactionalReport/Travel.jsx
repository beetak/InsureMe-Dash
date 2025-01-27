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
                            <div className="bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
                                <div className="flex justify-between items-center bg-gray-700 text-white">
                                    <span className="font-semibold">Client Details</span>
                                </div>
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
                                            <span className="inline-block w-44">Passport Number: </span>{sales.transactionDescription.user.passportNumber}
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
                            <div className=" bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
                                <div className="flex justify-between items-center bg-gray-700 text-white">
                                    <span className="font-semibold">User Details</span>
                                </div>
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
                    sales.travelers && sales.travelers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            <div className="flex flex-col">
                                <div className=" bg-gray-700 text-white border-b-2 border-gray-700 py-3 px-6">
                                    <div className="flex justify-between items-center bg-gray-700 text-white">
                                        <span className="font-semibold">Ad Ons Details</span>
                                    </div>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex w-full">
                                            <div className="bg-white rounded-xl shadow-md overflow-hidden md:w-1/3">
                                                <div className="flex w-full text-gray-700 font-bold">ZINARA LICENCE</div>
                                                <div className="flex-col w-full text-sm">
                                                    <p className="text-sm">
                                                        <span className="inline-block w-44">Policy: </span>{sales.travelers}
                                                    </p>
                                                </div>
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
