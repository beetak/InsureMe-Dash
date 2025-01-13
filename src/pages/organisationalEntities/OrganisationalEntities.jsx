import React, { useState } from 'react'
import WindowCard from '../../components/windowCard/WindowCard'
import SideBar from '../../components/navigation/sideBar/SideBar';
import TopBar from '../../components/navigation/topBar/TopBar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function OrganisationalEntities() {
  const settings = {
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: true,
    // dots: true,
  };
  
  const insurer  = ["Credsure", "ZimNat", "Old Mutual", "Allied", "FBC", "CBZ", "First Mutual"]

  const data = [
    { item: 1, name: 'Product A', datecreated: '2022-01-01', producttype: 'Type A' },
    { item: 2, name: 'Product B', datecreated: '2022-02-01', producttype: 'Type B' },
    { item: 3, name: 'Product C', datecreated: '2022-03-01', producttype: 'Type C' },
    { item: 4, name: 'Product D', datecreated: '2022-04-01', producttype: 'Type A' },
    { item: 5, name: 'Product E', datecreated: '2022-05-01', producttype: 'Type B' },
    { item: 6, name: 'Product F', datecreated: '2022-06-01', producttype: 'Type C' },
    { item: 7, name: 'Product G', datecreated: '2022-07-01', producttype: 'Type A' },
    { item: 8, name: 'Product H', datecreated: '2022-08-01', producttype: 'Type B' },
    { item: 9, name: 'Product I', datecreated: '2022-09-01', producttype: 'Type C' },
    // Add more dummy data items as needed
  ];

  const menus = [
    { title: "Motor Insurance", icon: "fas fa-car", tab:1 },
    { title: "Comprehensive", icon: "fas fa-rectangle-list", tab:2 },
    { title: "Third Party", icon: "fas fa-car-burst", tab:3 },
    { title: "Business", icon: "fas fa-briefcase", tab:4 },
    { title: "Property", icon: "fas fa-house", tab:5 },
    { title: "Funeral", icon: "fas fa-star-of-life", tab:6 },
    { title: "Health", icon: "fas fa-kit-medical", tab:7 },
    { title: "Life", icon: "fas fa-stethoscope", tab:8 },
    { title: "Travel", icon: "fas fa-plane", tab:9 },
    { title: "Livestock", icon: "fas fa-cow", tab:10 },
  ]

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const { key, direction } = sortConfig;
    if (key) {
      const sorted = [...data].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'asc' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      return sorted;
    }
    return data;
  };

  const renderTableHeader = () => {
    const columns = [
      { key: 'item', label: 'Item' },
      { key: 'name', label: 'Name' },
      { key: 'datecreated', label: 'Date Created' },
      { key: 'producttype', label: 'Product Type' },
    ];

    return columns.map((column) => (
      <th key={column.key} onClick={() => handleSort(column.key)} className='items-start '>
        <span className="mr-2">{column.label}</span>
        {sortConfig.key === column.key && (
          sortConfig.direction === 'asc' ? 
          <><span className="fas fa-chevron-up text-xs text-gray-800"/><span className="fas fa-chevron-down text-xs text-gray-400"/></>:
          <><span className="fas fa-chevron-up text-xs text-gray-400"/><span className="fas fa-chevron-down text-xs text-gray-800"/></>
        )}
        {sortConfig.key !== column.key && (
          <><span className="fas fa-chevron-up text-xs text-gray-400"/><span className="fas fa-chevron-down text-xs text-gray-400"/></>
        )}
      </th>
    ));
  };

  const renderTableRows = () => {
    const sortedDataArray = sortedData();

    return sortedDataArray.map((item, index) => (
      <tr key={index} className='divide-y divide-gray-700'>
        <td>{item.item}</td>
        <td>{item.name}</td>
        <td>{item.datecreated}</td>
        <td>{item.producttype}</td>
      </tr>
    ));
  };

  return (
    <>
      <SideBar/>
      <div className="flex-1 bg-white relative">
        <TopBar/>
        {/* Main content */}
        <div className="p-5 bg-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Main Content</h2>                
          <WindowCard title="Insurance Type Management">
            <div className="flex space-x-2 xs:p-4 p-0">
              <div className="w-48">
                {/* Tab selection buttons */}
                <div className="flex flex-col space-y-2">
                  {menus.map((item, index)=>(
                    <button
                      className={`border border-gray-300 text-xs rounded-sm px-4 py-2 text-gray-700 flex ${
                        activeTab === item.tab ? 'bg-gray-700 text-white' : ''
                      }`}
                      onClick={() => handleTabClick(item.tab)}
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
                      <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                        <h2 className="text-lg font-semibold">Insurance Creation Form</h2>
                        <p className="text-xs mb-4">For vehicle Insurance processing</p>
                          {/* <Slider {...settings}>
                            {
                            insurer.map((item, index)=>{
                              return(
                                <div key={index} onClick={""}>
                                  <h6 className="flex text-md justify-center font-semibold leading-1 h-8 cursor-pointer">{item}</h6>
                                </div>
                              )
                            })}
                          </Slider> */}
                        <div className='space-y-1'>
                          <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                              Car Make
                            </label>
                            <div className="mt-2 flex-1">
                              <input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="family-name"
                                placeholder='Insurance Type'
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                              Model
                            </label>
                            <div className="mt-2 flex-1">
                              <input
                                type="text"
                                name="adon"
                                id="adon"
                                autoComplete="family-name"
                                placeholder='Ad On'
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                              Year of Make
                            </label>
                            <div className="mt-2 flex-1">
                              <input
                                type="text"
                                name="adon"
                                id="adon"
                                autoComplete="family-name"
                                placeholder='Ad On'
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                              Owner Details
                            </label>
                            <div className="mt-2 flex-1">
                              <input
                                type="text"
                                name="adon"
                                id="adon"
                                autoComplete="family-name"
                                placeholder='Ad On'
                                className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                              Variant
                            </label>
                            <div className="mt-2 flex-1">
                              <select
                                id="insuranceType"
                                name="insuranceType"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                              >
                                <option value="Option 0">Full Cover</option>
                                <option value="Option 1">Third Party</option>
                              </select>
                            </div>
                          </div>
                          <div className="sm:col-span-3 flex items-center">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/6">
                              Usage
                            </label>
                            <div className="mt-2 flex-1">
                              <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-2 w-full"
                              >
                                <option value="">Select an option</option>
                                <option value="Option 1">Option 1</option>
                                <option value="Option 2">Option 2</option>
                                <option value="Option 3">Option 3</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className='flex space-x-2 pt-10'>
                          <button
                            className={`border border-gray-300 rounded-sm px-4 py-2 bg-blue-500 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                          >
                            Submit
                          </button>
                          <button
                            className={`border border-gray-300 rounded-sm px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                  {/* Tab 2 content */}
                  {
                    activeTab === 2 && 
                    <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                      <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                        <h2 className="text-lg font-semibold">Insurance Type Data</h2>
                        <div className='flex justify-between py-4'>
                          <div className="xl:col-span-3 flex items-center space-x-2">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                              Show
                            </label>
                            <div className="">
                              <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5"
                              >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="All">All</option>
                              </select>
                            </div>
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                              Entries
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="text"
                              name="adon"
                              id="adon"
                              autoComplete="family-name"
                              placeholder='Search'
                              className="rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <table className='w-full'>
                          <thead>
                            <tr>{renderTableHeader()}</tr>
                          </thead>
                          <tbody>{renderTableRows()}</tbody>
                        </table>
                      </div>
                    </div>
                  }
                  {/* Tab 3 content */}
                  {activeTab === 3 && <div>Tab 3 content</div>}
                </div>
              </div>
            </div>
          </WindowCard>
        </div>
      </div>
    </>
  )
}
