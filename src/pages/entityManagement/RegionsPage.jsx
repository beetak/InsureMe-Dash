import { useState } from "react";
import SideBar from "../../components/navigation/sideBar/SideBar";
import TopBar from "../../components/navigation/topBar/TopBar";
import WindowCard from "../../components/windowCard/WindowCard";
import RegionForm from "../../components/entities/regions/RegionForm";
import RegionsTable from "../../components/entities/regions/RegionsTable";

export default function RegionsPage() {
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
    { title: "Create Region", icon: "fas fa-pen-nib", tab:1 },
    { title: "View Regions", icon: "fas fa-book", tab:2 },
  ]

  const insurer  = ["Credsure", "ZimNat", "Old Mutual", "Allied", "FBC", "CBZ", "First Mutual"]

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
          <h2 className="text-2xl font-semibold mb-4">TelOne Regions</h2>                
          <WindowCard title="Region Management">
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
                      <RegionForm/>
                    </div>
                  }
                  {/* Tab 2 content */}
                  {
                    activeTab === 2 && 
                    <div className="p-7 bg-white rounded-xs border border-gray-200 border-solid border-1">
                      <RegionsTable/>
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
