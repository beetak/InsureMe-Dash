import React from 'react'
import { motion } from 'framer-motion'

export default function Motor({sales}) {
    const formatDate = (dateString) => {
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1; // Month is 0-indexed
        const day = parseInt(dateString.substring(6, 8), 10);
    
        const date = new Date(year, month, day);
    
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

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
                                    <span className="font-semibold">Transaction Details</span>
                                </div>
                            </div>
                            <div className="py-4">
                                <div className="space-y-4">
                                    <div className="flex-col w-full py-1 px-6 text-sm">
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Vehicle Registration: </span>{sales.transactionDescription.vehicle.VRN}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Vehicle: </span>{sales.transactionDescription.vehicle.make} {sales.transactionDescription.vehicle.model}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Year Of Manufacture: </span>{sales.transactionDescription.vehicle.year}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Usage: </span>Transport
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Policy: </span>{sales.transactionDescription.policy.insuranceType} - ${sales.transactionDescription.policy.premiumAmount}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Broker Name: </span>{sales.transactionDescription.policy.insuranceCompany}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Start Date: </span>{formatDate(sales.transactionDescription.policy.startDate)}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">End Date: </span>{formatDate(sales.transactionDescription.policy.endDate)}
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
                                            <span className="inline-block w-44">Username: </span>{sales.transactionDescription.user.username}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">Email Address: </span>{sales.transactionDescription.user.email}
                                        </p>
                                        <p className="text-sm">
                                            <span className="inline-block w-44">ID Number: </span>{sales.transactionDescription.user.idNumber||"Not Defined"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                {
                    (sales.transactionDescription.zbc && sales.transactionDescription.zbc.length > 0 || sales.transactionDescription.zinara && sales.transactionDescription.zinara.length > 0) && (
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
                                            <div className="bg-white rounded-xl shadow-md overflow-hidden md:w-1/2">
                                                <div className="flex w-full text-gray-700 font-bold">ZINARA LICENCE</div>
                                                <div className="flex-col w-full text-sm">
                                                    <p className="text-sm">
                                                        <span className="inline-block w-44">Policy: </span>{sales.transactionDescription.zinara.policy} {sales.transactionDescription.zinara.amount}
                                                    </p>
                                                    <p className="text-sm">
                                                        <span className="inline-block w-44">Start Date: </span>{sales.transactionDescription.zinara.startDate}
                                                    </p>
                                                    <p className="text-sm">
                                                        <span className="inline-block w-44">End Date: </span>{sales.transactionDescription.zinara.endDate}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-xl shadow-md overflow-hidden md:w-1/2">
                                                <div className="flex w-full text-gray-700 font-bold">ZBC LICENCE</div>
                                                <div className="flex-col w-full text-sm">
                                                    <p className="text-sm">
                                                        <span className="inline-block w-44">Policy: </span>{sales.transactionDescription.zbc.policy} {sales.transactionDescription.zbc.amount}
                                                    </p>
                                                    <p className="text-sm">
                                                        <span className="inline-block w-44">Start Date: </span>{sales.transactionDescription.zbc.startDate}
                                                    </p>
                                                    <p className="text-sm">
                                                        <span className="inline-block w-44">End Date: </span>{sales.transactionDescription.zbc.endDate}
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
