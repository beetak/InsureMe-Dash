import React from 'react'
import { motion } from 'framer-motion'

export default function Property({sales}) {
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
                      <span className="inline-block w-44">ID Number: </span><span className='uppercase'>{sales.transactionDescription.user.idNumber}</span>
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
                <span className="font-semibold">Property Details</span>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div className="flex-col w-full text-sm">
                    <p className="text-sm">
                      <span className="inline-block w-44">House Address: </span>{sales.transactionDescription.houseDetails.address}
                    </p>
                    <p className="text-sm">
                      <span className="inline-block w-44">House Value: </span>{sales.transactionDescription.houseDetails.value}
                    </p>
                    <p className="text-sm">
                      <span className="inline-block w-44">Roof Type: </span>{sales.transactionDescription.houseDetails.roofType}
                    </p>
                    {/* <p className="text-sm">
                      <span className="inline-block w-44">Cover Type: </span>{sales.transactionDescription.coverDetails.coverType}
                    </p> */}
                    {/* <p className="text-sm">
                      <span className="inline-block w-44">Start Date: </span>{formatDate(sales.transactionDescription.travelDetails.startDate)}
                    </p>
                    <p className="text-sm">
                      <span className="inline-block w-44">End Date: </span>{formatDate(sales.transactionDescription.travelDetails.endDate)}
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="flex flex-col">
            <div className=" bg-main-color text-white border-b-2 border-main-color py-3 px-6">
              <span className="font-semibold">Cover Travelers</span>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex-col w-full text-sm">
                  {/* <p className="text-sm">
                    <span className="inline-block w-44">Cover Type: </span>{sales.transactionDescription.coverDetails.coverType}
                  </p> */}
                  <p className="text-sm">
                    <span className="inline-block w-44">Currency: </span>{sales.transactionDescription.coverDetails.currency}
                  </p>
                  <p className="text-sm">
                    <span className="inline-block w-44">Rate: </span>{sales.transactionDescription.coverDetails.rate}%
                  </p>
                  <p className="text-sm">
                    <span className="inline-block w-44">Premium: </span>{sales.transactionDescription.coverDetails.premium}
                  </p>
                </div>
              </div>
          </div>
        </div>
      </motion.div>
    </div>
  </>
  )
}
