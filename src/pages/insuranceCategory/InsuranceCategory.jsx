import React, { useEffect, useState } from 'react'
import WindowCard from '../../components/windowCard/WindowCard'
import SideBar from '../../components/navigation/sideBar/SideBar';
import TopBar from '../../components/navigation/topBar/TopBar';
import CategoryForm from '../../components/category/CategoryForm';
import InsurerCategoriesTable from '../../components/category/InsurerCategoriesTable';
import { useDispatch } from 'react-redux';
import { fetchAsyncCategory } from '../../store/category-store';
import CategoriesTable from '../../components/category/CategoriesTable';
import useAuth from '../../hooks/useAuth';
import DisplayLayout from '../../components/Layout/DisplayLayout';

export default function InsuranceCategory() {

  const {user} = useAuth()
  const userRole = user.role

  const menus = [
    { title: "Create Category", icon: "fas fa-pen-nib", tab:1 },
    { title: "Categories List", icon: "fas fa-book", tab:2 },
    { title: "Company Categories", icon: "fas fa-book", tab:userRole==='ADMIN'?3:1 },
  ]

  const filteredMenus = menus.filter((menu) => {
    if (menu.title === "Create Category" && (userRole === "ADMIN")) {
      return true;
    } 
    if (menu.title === "Categories List" && userRole === "ADMIN") {
      return true;
    } 
    if (menu.title === "Company Categories" && (userRole === "INSURER_ADMIN" || userRole === "IT_ADMIN" || userRole === "PRODUCT_MANAGER" || userRole === "IT_SUPPORT" || userRole === "MANAGER" || userRole === "TREASURY_ACCOUNTANT")) {
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
        <div className="bg-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Insurance Category</h2>                
          <WindowCard title="Category Management">
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
                    userRole==="ADMIN"?<>
                    {/* Tab 1 content */}
                    {
                      
                      activeTab === 1 && 
                      <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                        <CategoryForm/>
                      </div>
                    }
                    {/* Tab 2 content */}
                    {
                      activeTab === 2 && 
                      <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                        <CategoriesTable/>
                      </div>
                    }
                    </>:
                    activeTab === 1 && 
                    <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                      <CategoriesTable/>
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
