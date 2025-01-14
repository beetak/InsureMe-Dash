import React from 'react'
import WindowCard from '../../components/windowCard/WindowCard'
import UserProfile from '../../components/user/profile/UserProfile'
import DisplayLayout from '../../components/Layout/DisplayLayout'

export default function AccountManagement() {
  return (
    <>
        <DisplayLayout>
            {/* Main content */}
            <div className="bg-gray-100">               
                <WindowCard title="Account Management">
                    <div className="flex space-x-2 xs:p-4 p-0">
                        <UserProfile/>
                    </div>
                </WindowCard>
            </div>
        </DisplayLayout>
    </>
  )
}
