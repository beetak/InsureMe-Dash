import React, { useEffect, useState } from 'react'
import PolicyTable from '../../components/products/PolicyTable';
import TravelInsuranceForm from '../../components/products/Travel/TravelInsuranceForm';
import TravelInsuranceTable from '../../components/products/Travel/TravelInsuranceTable';
import useAuth from '../../hooks/useAuth';

export default function TravelInsurance() {

  const {user} = useAuth()
  const userRole = user.role

  const menus = [
    { title: "Create Insurance", icon: "fas fa-pen-nib", tab:1 },
    { title: "View Policies", icon: "fas fa-book", tab:2 },
    { title: "Insurance Products", icon: "fas fa-book", tab:userRole==='ADMIN'?3:2 },
  ]

  const filteredMenus = menus.filter((menu) => {
    if (menu.title === "Create Insurance" && (userRole === "ADMIN" || userRole === "INSURER_ADMIN")) {
      return true;
    } 
    if (menu.title === "View Policies" && userRole === "ADMIN") {
      return true;
    } 
    if (menu.title === "Insurance Products" && userRole === "INSURER_ADMIN") {
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
        {/* Main content */}
        <div className="bg-gray-100">      
            <div className="flex-col space-x-2 xs:p-4 p-0">
                {/* Tab selection buttons */}
                <div className="flex flex-1 p-2 space-x-2">
                  {filteredMenus.map((item, index)=>(
                    <button
                      className={`border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex ${
                        activeTab === item.tab ? 'bg-secondary-color text-white' : ''
                      }`}
                      onClick={() => handleTabClick(item.tab)}
                      key={index}
                    >
                      <span className={`fas ${item.icon} mr-2 mt-[2px]`}/>
                      {item.title}
                    </button>
                  ))}
                </div>
              <div className="flex-1">
                {/* Tab content */}
                <div>
                  {
                    userRole === 'ADMIN' ? <>
                      {/* Tab 1 content */}
                      {
                        activeTab === 1 && 
                        <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                          <TravelInsuranceForm/>
                        </div>
                      }
                      {/* Tab 2 content */}
                      {
                        activeTab === 2 && 
                        <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                          <TravelInsuranceTable/>
                        </div>
                      }
                      {/* Tab 3 content */}
                      {activeTab === 3 && 
                        <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                          <PolicyTable/>
                        </div>
                      }
                    </>:
                    <>
                      {/* Tab 1 content */}
                      {
                        activeTab === 1 && 
                        <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                          <TravelInsuranceForm/>
                        </div>
                      }
                      {/* Tab 2 content */}
                      {
                        activeTab === 2 && 
                        <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                          <TravelInsuranceTable/>
                        </div>
                      }
                    </>
                  }
                  
                </div>
              </div>
            </div>
        </div>
    </>
  )
}
