import React from 'react'
import TopBar from '../navigation/topBar/TopBar'
import SideBar from '../navigation/sideBar/SideBar'

export default function DisplayLayout({ children }) {
    return (
        <div className="flex h-screen bg-white  w-full">
            <SideBar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 lg:ml-64">
                    {children}
                </main>
            </div>
        </div>
    )
}

