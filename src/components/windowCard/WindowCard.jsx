import React from 'react'

export default function WindowCard({ title, children }) {
  return (
    <>
        <div className="xs:p-5 p-2 xs:m-5 m-1 bg-white rounded-md border border-gray-200 border-solid border-1">
          <h2 className="xs:text-lg sm:text-lg text-xs md:text-lg font-semibold mb-4">{title}</h2>
          {children}
        </div>
    </>
  )
}
