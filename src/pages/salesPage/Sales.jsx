import React, { useEffect, useState } from 'react'
import { getInvoiceStatus, getQuoteStatus } from '../../store/nav-store';
import WindowCard from '../../components/windowCard/WindowCard';
import SalesForm from '../../components/sales/SalesForm';
import SalesInvoice from '../../components/sales/SalesInvoice';
import MotorInsuranceSales from '../../components/sales/MotorInsurance/MotorInsuranceSalesForm';
import { useSelector } from 'react-redux';
import MotorVehicleQuote from '../../components/sales/MotorInsurance/MotorVehicleQuote';
import MotorInsuranceInvoice from '../../components/sales/MotorInsurance/MotorInsuranceInvoice';
import TravelInsuranceSales from '../../components/sales/TravelInsurance/TravelInsuranceSalesForm';
import TravelInsuranceInvoice from '../../components/sales/TravelInsurance/TravelInsuranceInvoice';
import TravelVehicleQuote from '../../components/sales/TravelInsurance/TravelVehicleQuote';
import PropertyInsuranceSales from '../../components/sales/PropertyInsurance/PropertyInsuranceSalesForm';
import useAuth from '../../hooks/useAuth';
import InsuranceApi, { setupInterceptors } from '../../components/api/InsuranceApi';
import DisplayLayout from '../../components/Layout/DisplayLayout';

export default function Sales() {

  const {user, setUser} = useAuth()

  const invoiceState = useSelector(getInvoiceStatus)
  const quoteState = useSelector(getQuoteStatus)
  const [activeTab, setActiveTab] = useState("");

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(()=>{
    setupInterceptors(() => user, setUser);
    fetchCategory()
  },[])

  const fetchCategory = async () => {
    setLoading(true)
    const status = true
    try{
      const response = await InsuranceApi.get(`/categories/status/${status}`)
      if(response&&response.data.httpStatus==="OK"){
        console.log(response)
        const updatedMenus = response.data.data.map((item, i) => {
          return {
            title: item.categoryName,
            icon:  item.iconUrl,
            tab: item.categoryName,
          };
        });
        setMenus(updatedMenus);
        // Set activeTab to the first tab if there are available menus
        if (updatedMenus.length > 0) {
          setActiveTab(updatedMenus[0].tab);
        }
      }
    }
    catch(err){
      console.log(error)
      if(err){
        console.log(err)
      }
      else if(err){
        console.log(err)
      }
    }
    finally{
      setLoading(false)
    }
  }

  const settings = {
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: true,
    // dots: true,
  };

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  

  return (
    <>
      <DisplayLayout>
        {/* Main content */}
        <div className="bg-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Product Sales</h2>                
          <WindowCard title="Insurance Sale By Type">
            <div className="flex space-x-2 xs:p-4 p-0">
              <div className="w-48">
                {/* Tab selection buttons */}
                <div className="flex flex-col space-y-2">
                  {menus.length>0?menus.map((item, index)=>(
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
                  )):
                  <button
                    className="border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex "
                  >
                    <span className={`fas fa-triangle-exclamation mr-2 mt-[2px]`}/>
                    No Categories
                  </button>}
                </div>
              </div>
              <div className="flex-1">
                {/* Tab content */}
                <div>
                {
                  menus.length > 0 ? (
                    <div>
                  {/* Tab 1 content */}
                  {
                    activeTab === "Motor Vehicle Insurance" && 
                    <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                      {
                        quoteState&&!invoiceState?<MotorVehicleQuote/>:!quoteState&&invoiceState?<MotorInsuranceInvoice/>:<MotorInsuranceSales/>
                      }
                    </div>
                  }
                  {/* Tab 2 content */}
                  {
                    activeTab === "Travel Insurance" && 
                    <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                      {
                        quoteState&&!invoiceState?<TravelVehicleQuote/>:!quoteState&&invoiceState?<TravelInsuranceInvoice/>:<TravelInsuranceSales/>
                      }
                    </div>
                  }
                  {/* Tab 3 content */}
                  {activeTab === "Property Insurance" && 
                    <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                      {
                        quoteState&&!invoiceState?<TravelVehicleQuote/>:!quoteState&&invoiceState?<TravelInsuranceInvoice/>:<PropertyInsuranceSales/>
                      }
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
                        activeTab !== "Motor Vehicle Insurance" &&
                        <div className="p-7 flex justify-center bg-white rounded-xs border border-gray-200 border-solid border-1">
                          Coming Soon
                        </div>
                      }  </div>
                    ) : (
                      <div className="p-7 bg-white flex justify-center rounded-xs border border-gray-200 border-solid border-1">
                        Reload Page
                      </div>
                    )}
                </div>
              </div>
            </div>
          </WindowCard>
        </div>
      </DisplayLayout>
    </>
  )
}
