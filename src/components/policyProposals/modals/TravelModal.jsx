import React from 'react'

export default function TravelModal(props) {
    const isOpen = false

    return (
        <div className='flex flex-col flex-1 h-screen justify-center bg-gray-200 bg-opacity-50 items-center fixed inset-0 z-50 top-0 left-0' onClick={() => props.setModal(isOpen)}>
            <div className='flex flex-col w-4/5 justify-center bg-white p-8 rounded-lg border border-gray-200' onClick={(e) => e.stopPropagation()}>
                <div className='w-full flex justify-end'>
                    <a 
                        href="#"
                        onClick={() => props.setModal(isOpen)}
                        className='bg-gray-500 w-8 h-8 rounded-full flex justify-center items-center'
                    >
                        <i className='fas fa-times text-white'/>
                    </a>
                </div>
                <p className='mb-3'>Personal Details</p>
                <div className="flex space-x-8 relative">                    
                    <p className='flex flex-col text-xs'>Name: <span className='text-[14px]'>{props.data.clientDetails.name}</span></p>
                    <p className='flex flex-col text-xs'>Passport No.: <span className='text-[14px]'>{props.data.clientDetails.passportNumber}</span></p>
                    <p className='flex flex-col text-xs'>Passport Expiry Date.: <span className='text-[14px]'>{props.data.clientDetails.passportExpiry}</span></p>
                    <p className='flex flex-col text-xs'>Occupation: <span className='text-[14px]'>{props.data.clientDetails.occupation}</span></p>
                    <p className='flex flex-col text-xs'>Email: <span className='text-[14px]'>{props.data.clientDetails.emailAddress}</span></p>
                    <p className='flex flex-col text-xs'>Address: <span className='text-[14px]'>{props.data.clientDetails.physicalAddress}</span></p>
                    <div className='flex flex-col text-xs'>
                        <p>Paasport Attachment:</p> 
                        <button
                            onClick={""}
                        className={`space-x-2 items-center border-gray-300 rounded-full px-4 h-6 m bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                    >
                        <i className='fas fa-download text-xs'/>
                        <span className='text-xs'>Download</span>
                    </button></div>
                </div>
                <p className='my-3'>Children Details</p>
                <div className="flex space-x-8 relative">                    
                    <p className='flex flex-col text-xs'>Name: <span className='text-[14px]'>{props.data.clientDetails.name}</span></p>
                    <p className='flex flex-col text-xs'>Passport No.: <span className='text-[14px]'>{props.data.clientDetails.passportNumber}</span></p>
                    <p className='flex flex-col text-xs'>Passport Expiry Date.: <span className='text-[14px]'>{props.data.clientDetails.passportExpiry}</span></p>
                    <div className='flex flex-col text-xs'>
                        <p>Paasport Attachment:</p> 
                        <button
                            onClick={""}
                        className={`space-x-2 items-center border-gray-300 rounded-full px-4 h-6 m bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                    >
                        <i className='fas fa-download text-xs'/>
                        <span className='text-xs'>Download</span>
                    </button></div>
                </div>
                <div className="flex space-x-8 relative">                    
                    <p className='flex flex-col text-xs'>Name: <span className='text-[14px]'>{props.data.clientDetails.name}</span></p>
                    <p className='flex flex-col text-xs'>Passport No.: <span className='text-[14px]'>{props.data.clientDetails.passportNumber}</span></p>
                    <p className='flex flex-col text-xs'>Passport Expiry Date.: <span className='text-[14px]'>{props.data.clientDetails.passportExpiry}</span></p>
                    <div className='flex flex-col text-xs'>
                        <p>Paasport Attachment:</p> 
                        <button
                            onClick={""}
                        className={`space-x-2 items-center border-gray-300 rounded-full px-4 h-6 m bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                    >
                        <i className='fas fa-download text-xs'/>
                        <span className='text-xs'>Download</span>
                    </button></div>
                </div>
                <p className='mb-3'>Travel Details</p>
                <div className="flex space-x-8 relative">                    
                    <p className='flex flex-col text-xs'>Residence Country: <span className='text-[14px]'>{props.data.residenceCountry}</span></p>
                    <p className='flex flex-col text-xs'>Destination Country: <span className='text-[14px]'>{props.data.destinationCountry}</span></p>
                    <p className='flex flex-col text-xs'>Departure Date.: <span className='text-[14px]'>{props.data.departureDate}</span></p>
                    <p className='flex flex-col text-xs'>Return Date: <span className='text-[14px]'>{props.data.returnDate}</span></p>
                    <p className='flex flex-col text-xs'>Coverage: <span className='text-[14px]'>Up to 21 Days</span></p>
                    <div className='flex flex-col text-xs'>
                        <p>Paasport Attachment:</p> 
                        <button
                            onClick={""}
                        className={`space-x-2 items-center border-gray-300 rounded-full px-4 h-6 m bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                    >
                        <i className='fas fa-download text-xs'/>
                        <span className='text-xs'>Download</span>
                    </button></div>
                </div>
                <p className='mb-3'>Comments</p>
                <div className="flex space-x-8">
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit, accusantium quod distinctio aliquid numquam ipsum quis architecto, at esse cumque? Unde dicta veritatis aut cum harum ea aliquid fugit alias, voluptas autem quisquam consequatur vel vitae natus nisi cumque aliquam laboriosam ab accusantium voluptatem deserunt sed exercitationem et? Ipsa, a nisi, autem eveniet quos ea minima veritatis odio optio quisquam quam natus aut magnam tempora esse, quo voluptates?</p>
                </div>
                <p className='mb-3'>Action</p>
                <div className="flex relative   items-center"> 
                    <button
                        onClick={""}
                        className={`space-x-2 items-center border-gray-300 rounded-l-full px-4 h-6 m bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                    >
                        <i className='fas fa-eye text-xs'/>
                        <span className='text-xs'>Approve</span>
                    </button>                  
                    <button
                        onClick={""}
                        className={`space-x-2 border-gray-300 items-center px-4 h-6 bg-blue-500 text-gray-100 hover:text-blue-500 hover:bg-white`}
                    >
                        <i className='fas fa-pen text-xs'/>
                        <span className='text-xs'>Accept</span>
                    </button>
                    <button
                        onClick={""}
                        className={`space-x-2 border-gray-300 items-center rounded-r-full px-4 h-6 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                    >
                        <i className='fas fa-trash text-xs'/>
                        <span className='text-xs'>Reject</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
