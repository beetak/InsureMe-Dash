import React, { useState } from 'react'
import WindowCard from '../../components/windowCard/WindowCard'
import InsurerUsersTable from '../../components/user/insurers/InsurerUsersTable';
import InsurerUserForm from '../../components/user/insurers/InsurerUserForm';
import DisplayLayout from '../../components/Layout/DisplayLayout';
import useAuth from '../../hooks/useAuth';

export default function InsurerUsers() {

  const {user} = useAuth()
  const userRole = user.role

  const menus = [
    { title: "Create User", icon: "fas fa-pen-nib", tab:1 },
    { title: "View Users", icon: "fas fa-book", tab:(userRole==="ADMIN"||userRole==="INSURER_ADMIN"||userRole==="IT_ADMIN"||userRole==="IT_SUPPORT"||userRole==="IT_MANAGER")?2:1 },
  ]
  
  const filteredMenus = menus.filter((menu) => {
    if (menu.title === "Create User" && (userRole === "ADMIN"||userRole === "INSURER_ADMIN"||userRole === "IT_ADMIN"||userRole === "IT_SUPPORT"||userRole === "IT_MANAGER")) {
      return true;
    } 
    if (menu.title === "View Users" && (userRole === "ADMIN"||userRole === "INSURER_ADMIN"||userRole === "IT_ADMIN"||userRole ==="PRODUCT_MANAGER"||userRole==="IT_SUPPORT"||userRole==="MANAGER"||userRole==="TREASURY_ACCOUNTANT")) {
      return true;
    }  
    return false;
  });

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <>
      <DisplayLayout>
        {/* Main content */}
        <div className="bg-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Insurer Administrators</h2>                
          <WindowCard title="Insurance Company Admins">
            <div className="flex space-x-2 xs:p-4 p-0">
              <div className="w-48">
                {/* Tab selection buttons */}
                <div className="flex flex-col space-y-2">
                  {filteredMenus.map((item, index)=>(
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
                  {
                    (userRole==="ADMIN"||userRole==="INSURER_ADMIN"||userRole==="IT_SUPPORT"||userRole==="IT_MANAGER")?<>
                    {/* Tab 1 content */}
                    {
                      
                      activeTab === 1 && 
                      <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                        <InsurerUserForm/>
                      </div>
                    }
                    {/* Tab 2 content */}
                    {
                      activeTab === 2 && 
                      <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                        <InsurerUsersTable/>
                      </div>
                    }
                    </>:
                    activeTab === 1 && 
                    <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                      <InsurerUsersTable/>
                      {/* <InsurerCategoriesTable/> */}
                    </div>
                  }
                </div>
              </div>
            </div>
          </WindowCard>
        </div>
      </DisplayLayout>
    </>
  )
}
