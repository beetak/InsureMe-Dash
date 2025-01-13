import React from 'react'
import SideBar from '../../components/navigation/sideBar/SideBar'
import TopBar from '../../components/navigation/topBar/TopBar'
import WindowCard from '../../components/windowCard/WindowCard'
import UserProfile from '../../components/user/profile/UserProfile'

export default function AccountManagement() {
  return (
    <>
        <SideBar/>
        <div className="flex-1 bg-white relative">
            <TopBar/>
            {/* Main content */}
            <div className="p-5 bg-gray-100">               
                <WindowCard title="Account Management">
                    <div className="flex space-x-2 xs:p-4 p-0">
                        <UserProfile/>
                    </div>
                </WindowCard>
            </div>
        </div>
    </>
  )
}
