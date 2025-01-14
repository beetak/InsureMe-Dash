import React, { useState } from 'react'
import WindowCard from '../../components/windowCard/WindowCard'
import SideBar from '../../components/navigation/sideBar/SideBar';
import TopBar from '../../components/navigation/topBar/TopBar';
import ReportsTable from '../../components/reports/ReportsTable';
import SalesTable from '../../components/sales/SalesTable';
import NationalSales from '../../components/reports/NationalSales';
import ShopSales from '../../components/reports/ShopSales';
import AgentSales from '../../components/reports/AgentSales';
import InsurerSales from '../../components/reports/InsurerSales';
import Transaction from '../../components/reports/Transaction';
import DailySales from '../../components/reports/DailySales';
import PolicyReport from '../../components/reports/PolicyReport';
import Commissions from '../../components/reports/Commissions';
import useAuth from '../../hooks/useAuth';
import DisplayLayout from '../../components/Layout/DisplayLayout';

export default function Claims() {

  const {user} = useAuth()
  const userRole = user.role

  const menus = [
    { title: "National Sales", icon: "fas fa-pen-nib", tab:1 },
    { title: "Shop Sales", icon: "fas fa-book", tab:2 },
    { title: "Commission", icon: "fas fa-book", tab:4 },
    { title: "Agent Sales", icon: "fas fa-book", tab:userRole==='INSURER_ADMIN'?1:3 },
    { title: "Tax", icon: "fas fa-book", tab:5 },
    { title: "Policy", icon: "fas fa-book", tab:6 },
    { title: "Insurer", icon: "fas fa-book", tab:7 },
    // { title: "Insurer", icon: "fas fa-book", tab:8 },
    { title: "Sales", icon: "fas fa-book", tab:userRole==='INSURER_ADMIN'?2:'' },
    { title: "Daily Sales", icon: "fas fa-book", tab:userRole==='INSURER_ADMIN'?3:8},
    { title: "Transaction", icon: "fas fa-book", tab:userRole==='INSURER_ADMIN'?4:9 },
    { title: "Commissions", icon: "fas fa-book", tab:userRole==='INSURER_ADMIN'?5:10 },
    // { title: "Insurer", icon: "fas fa-book", tab:7 },
  ]

  const filteredMenus = menus.filter((menu) => {
    if (menu.title === "National Sales" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
      return true;
    }
    if (menu.title === "Agent Sales" && (userRole === "INSURER_ADMIN" || userRole === "ADMIN")) {
      return true;
    }
    if (menu.title === "Policy" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
      return true;
    }
    if (menu.title === "Shop Sales" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
      return true;
    }
    if (menu.title === "Insurer" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN")) {
      return true;
    }
    if (menu.title === "Transaction" && (userRole === "SUPER_ADMINISTRATOR" || userRole === "ADMIN" || userRole === "INSURER_ADMIN" || userRole === "SALES_AGENT")) {
        return true;
    }
    if (menu.title === "Sales" && (userRole === "INSURER_ADMIN")) {
        return true;
    }
    if (menu.title === "Daily Sales" && (userRole === "ADMIN" || userRole === "INSURER_ADMIN" || userRole === "SALES_AGENT")) {
        return true;
    } 
    if (menu.title === "Commissions" && (userRole === "ADMIN" || userRole === "INSURER_ADMIN")) {
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
          <h2 className="text-2xl font-semibold mb-4">Business Reports</h2>                
          <WindowCard title="Reports Classified as:">
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
                      userRole === "ADMIN"?
                      <>
                        {/* Tab 1 content */}
                        {
                          activeTab === 1 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <NationalSales/>
                          </div>
                        }
                        {/* Tab 2 content */}
                        {
                          activeTab === 2 && 
                          <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                            <ShopSales/>
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
