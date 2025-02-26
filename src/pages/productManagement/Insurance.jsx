import React, { useEffect, useState } from 'react';
import WindowCard from '../../components/windowCard/WindowCard';
import MotorVehicle from './MotorVehicle';
import TravelInsurance from './TravelInsurance';
import PropertyInsurance from './PropertyInsurance';
import useAuth from '../../hooks/useAuth';
import InsuranceApi, { setupInterceptors } from '../../components/api/InsuranceApi';
import DisplayLayout from '../../components/Layout/DisplayLayout';

export default function Insurance() {
  const { user, setUser } = useAuth();

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(""); // Initialize as an empty string

  useEffect(() => {
    setupInterceptors(() => user, setUser);
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    setLoading(true);
    const status = true;
    try {
      const response = await InsuranceApi.get(`/categories/status/${status}`);
      if (response && response.data.httpStatus === "OK") {
        console.log(response);
        const updatedMenus = response.data.data
          .map((item) => ({
            title: item.categoryName,
            icon: item.iconUrl,
            tab: item.categoryName,
          }))
          .filter(item => item.title !== "Motor Vehicle Insurance"); // Filter out the specific title

        setMenus(updatedMenus);

        // Set activeTab to the first tab if there are available menus
        if (updatedMenus.length > 0) {
          setActiveTab(updatedMenus[0].tab);
        }
      }
    } catch (err) {
      setCatResponse("Error fetching resource, Please check your network connection");
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Update activeTab with the clicked tab
  };

  return (
    <>
      <DisplayLayout>
        <div className="bg-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Insurance Products</h2>
          <WindowCard title="Product Management">
            <div className="flex space-x-2 xs:p-4 p-0">
              <div className="w-48">
                {/* Tab selection buttons */}
                <div className="flex flex-col space-y-2">
                  {menus.length > 0 ? (
                    menus.map((item, index) => (
                      <button
                        className={`border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex ${
                          activeTab === item.tab ? 'bg-main-color text-white' : ''
                        }`}
                        onClick={() => handleTabClick(item.tab)}
                        key={index}
                      >
                        <span className={`fas ${item.icon} mr-2 mt-[2px]`} />
                        {item.title}
                      </button>
                    ))
                  ) : (
                    <button className="border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex">
                      <span className={`fas fa-triangle-exclamation mr-2 mt-[2px]`} />
                      No Categories
                    </button>
                  )}
                </div>
              </div>
              <div className="flex-1">
                {/* Tab content */}
                {
                  menus.length > 0 ? (
                    <div>
                      {/* Tab 1 content */}
                      {activeTab === "Motor Vehicle Insurance" && 
                        <div className="bg-white rounded-xs border border-gray-200 border-solid border-1">
                          <MotorVehicle/>
                        </div>
                      }
                      {activeTab === "Travel Insurance" && 
                        <div className="bg-white rounded-xs border border-gray-200 border-solid border-1">
                          <TravelInsurance />
                        </div>
                      }
                      {activeTab === "Property Insurance" && 
                        <div className="bg-white rounded-xs border border-gray-200 border-solid border-1">
                          <PropertyInsurance />
                        </div>
                      }
                      {activeTab === "Life Insurance" && 
                        <div className="p-7 flex justify-center bg-white rounded-xs border border-gray-200 border-solid border-1">
                          Coming Soon
                        </div>
                      }
                      {activeTab === "Funeral Cover" && 
                        <div className="p-7 flex justify-center bg-white rounded-xs border border-gray-200 border-solid border-1">
                          Coming Soon
                        </div>
                      }
                      {activeTab === "Health Insurance" && 
                        <div className="p-7 flex justify-center bg-white rounded-xs border border-gray-200 border-solid border-1">
                          Coming Soon
                        </div>
                      }
                      {/* Default content */}
                      {activeTab !== "Property Insurance" && 
                        activeTab !== "Travel Insurance" &&
                        <div className="p-7 flex justify-center bg-white rounded-xs border border-gray-200 border-solid border-1">
                          Coming Soon
                        </div>
                      }
                    </div>
                  ) : (
                    <div className="p-7 bg-white flex justify-center rounded-xs border border-gray-200 border-solid border-1">
                      Reload Page
                    </div>
                  )}
              </div>
            </div>
          </WindowCard>
        </div>
      </DisplayLayout>
    </>
  );
}