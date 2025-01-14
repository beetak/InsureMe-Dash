import React, { useState } from 'react'
import WindowCard from '../../components/windowCard/WindowCard'
import SalesTable from '../../components/sales/SalesTable';
import NationalSales from '../../components/reports/NationalSales';
import ShopSales from '../../components/reports/ShopSales';
import AgentSales from '../../components/reports/AgentSales';
import InsurerSales from '../../components/reports/InsurerSales';
import Transaction from '../../components/reports/Transaction';
import DailySales from '../../components/reports/DailySales';
import PolicyReport from '../../components/reports/PolicyReport';
import Commissions from '../../components/reports/Commissions';
import PropertyProposals from '../../components/policyProposals/PropertyProposals';
import TravelProposals from '../../components/policyProposals/TravelProposals';
import DisplayLayout from '../../components/Layout/DisplayLayout';

const userRole = localStorage.getItem('role')

export default function Proposals() {

  const menus = [
    { title: "Property", icon: "fas fa-home", tab:1 },
    { title: "Travel", icon: "fas fa-plane", tab:2 },
    { title: "Life", icon: "fas fa-pen", tab:3 },
  ]

  const filteredMenus = menus.filter((menu) => {
    if (menu.title === "Property" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
      return true;
    }
    if (menu.title === "Travel" && (userRole === "INSURER_ADMIN" || userRole === "ADMIN")) {
      return true;
    }
    if (menu.title === "Life" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
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
          <h2 className="text-2xl font-semibold mb-4">Policy Proposals</h2>                
          <WindowCard title="Reports Classified as:">
            <div className="flex space-x-2 xs:p-4 p-0">
              <div className="w-48">
                {/* Tab selection buttons */}
                <div className="flex flex-col space-y-2">
                  {filteredMenus.map((item, index)=>(
                    <button
                      className={`border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex ${
                        activeTab === item.tab ? 'bg-gray-700 text-white' : ''
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
                      userRole === "ADMIN"?
                      <>
                        {/* Tab 1 content */}
                        {
                          activeTab === 1 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <PropertyProposals/>
                          </div>
                        }
                        {/* Tab 2 content */}
                        {
                          activeTab === 2 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <TravelProposals/>
                          </div>
                        }
                        {/* Tab 3 content */}
                        {activeTab === 3 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <AgentSales/>
                          </div>
                        }
                        {/* Tab 4 content */}
                        {activeTab === 4 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <SalesTable/>
                          </div>
                        }
                        {/* Tab 5 content */}
                        {activeTab === 5 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <SalesTable/>
                          </div>
                        }
                        {/* Tab 6 content */}
                        {activeTab === 6 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <PolicyReport/>
                          </div>
                        }
                        {/* Tab 7 content */}
                        {activeTab === 7 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <InsurerSales/>
                          </div>
                        }
                        {/* Tab 8 content */}
                        {activeTab === 8 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <DailySales/>
                          </div>
                        }
                        {/* Tab 9 content */}
                        {activeTab === 9 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <Transaction/>
                          </div>
                        }
                        {/* Tab 10 content */}
                        {activeTab === 10 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <Commissions/>
                          </div>
                        }
                      </>:
                      <>
                        {/* Tab 1 content */}
                        {
                          activeTab === 1 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <AgentSales/>
                          </div>
                        }
                        {/* Tab 2 content */}
                        {
                          activeTab === 2 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <NationalSales/>
                          </div>
                        }
                        {/* Tab 2 content */}
                        {
                          activeTab === 3 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <ShopSales/>
                          </div>
                        }
                        {/* Tab 3 content */}
                        {activeTab === 4 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <Transaction/>
                          </div>
                        }
                        {/* Tab 4 content */}
                        {activeTab === 5 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <Commissions/>
                          </div>
                        }
                      </>
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
