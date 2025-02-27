import React, { useEffect, useState } from 'react'
import WindowCard from '../../components/windowCard/WindowCard'
import PolicyForm from '../../components/policy/PolicyForm';
import PolicyTable from '../../components/policy/PolicyTable';
import { fetchAsyncCategory } from '../../store/category-store';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import DisplayLayout from '../../components/Layout/DisplayLayout';

export default function Policy() {

  const {user} = useAuth()

  const userRole = user.role

  const dispatch = useDispatch()

  const menus = [
    { title: "Create Policy", icon: "fas fa-pen-nib", tab:1 },
    { title: "View All Policies", icon: "fas fa-book", tab:userRole==='ADMIN'?2:1 },
  ]

  const filteredMenus = menus.filter((menu) => {
    if (menu.title === "Create Policy" && (userRole === "ADMIN")) {
      return true;
    } 
    if (menu.title === "View All Policies" && (userRole === "ADMIN" || userRole === "INSURER_ADMIN" || userRole === "IT_ADMIN" || userRole === "PRODUCT_MANAGER" || userRole === "IT_SUPPORT" || userRole === "MANAGER" || userRole === "TREASURY_ACCOUNTANT")) {
      return true;
    }   
    return false;
  });

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  useEffect(()=>{
    dispatch(fetchAsyncCategory())
  },[dispatch])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const polTab = params.get('policyTab')
    if (polTab) {
        setActiveTab(userRole==='INSURER_ADMIN' ? 1 : 2)
    }
  }, [location])

  return (
    <>
      <DisplayLayout>
        <div className="bg-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Policy</h2>                
          <WindowCard title="Insurance Policy Management">
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
                        <PolicyForm/>
                      </div>
                    }
                    {/* Tab 2 content */}
                    {
                      activeTab === 2 && 
                      <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                        <PolicyTable/>
                      </div>
                    }
                    </>:
                    activeTab === 1 && 
                    <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                      <PolicyTable/>
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
