import React, { useState } from 'react'
import WindowCard from '../../components/windowCard/WindowCard'
import SideBar from '../../components/navigation/sideBar/SideBar';
import TopBar from '../../components/navigation/topBar/TopBar';
import InternalUsersTable from '../../components/user/internal/InternalUsersTable';
import InternalUserForm from '../../components/user/internal/InternalUserForm';
import DisplayLayout from '../../components/Layout/DisplayLayout';

export default function InternalUsers() {

  const menus = [
    { title: "Create User", icon: "fas fa-pen-nib", tab:1 },
    { title: "View User", icon: "fas fa-book", tab:2 },
  ]

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <>
      <DisplayLayout>
        {/* Main content */}
        <div className="bg-gray-100">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>                
          <WindowCard title="User Management Tabs">
            <div className="flex space-x-2 xs:p-4 p-0">
              <div className="w-48">
                {/* Tab selection buttons */}
                <div className="flex flex-col space-y-2">
                  {menus.map((item, index)=>(
                    <button
                      className={`border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex ${
                        activeTab === item.tab ? 'bg-main-color text-white' : ''
                      }`}
                      onClick={() => handleTabClick(item.tab)}
                      key={index}
                    >
                      <span className={`fas ${item.icon} mr-2 mt-[2px]`}/>
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                {/* Tab content */}
                <div>
                  {/* Tab 1 content */}
                  {
                    activeTab === 1 && 
                    <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                      <InternalUserForm/>
                    </div>
                  }
                  {/* Tab 2 content */}
                  {
                    activeTab === 2 && 
                    <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                      <InternalUsersTable/>
                    </div>
                  }
                  {/* Tab 3 content */}
                  {activeTab === 3 && <div>Tab 3 content</div>}
                </div>
              </div>
            </div>
          </WindowCard>
        </div>
      </DisplayLayout>
    </>
  )
}
