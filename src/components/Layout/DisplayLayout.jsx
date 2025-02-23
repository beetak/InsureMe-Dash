import React, { useState } from 'react'
import TopBar from '../navigation/topBar/TopBar'
import SideBar from '../navigation/sideBar/SideBar'

export default function DisplayLayout({ children }) {
    const [isOpen, setIsOpen] = React.useState(true)

    return (
        <div className="flex h-screen bg-white  w-full">
            <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar isOpen={isOpen}/>
                <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 transition-all duration-300 ease-in-out ${isOpen ? "ml-64" : "ml-16"}`}>
                    {children}
                </main>
            </div>
        </div>
    )
}

