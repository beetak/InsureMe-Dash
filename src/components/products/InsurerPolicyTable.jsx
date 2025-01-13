import React, { useState } from 'react'
import { deleteVehicleInsurance } from '../../store/vehicle-store';

export default function InsurerPolicyTable() {

    const data = [
        { item: 1, name: 'Old Mutual', datecreated: '2022-01-01', address: 'Type A', api: true },
        { item: 2, name: 'FBC Insurance', datecreated: '2022-02-01', address: 'Type B', api: false },
        { item: 3, name: 'AFC Insurance', datecreated: '2022-03-01', address: 'Type C', api: false },
        { item: 4, name: 'CredSure', datecreated: '2022-04-01', address: 'Type A', api: true },
        { item: 5, name: 'Sanctuary', datecreated: '2022-05-01', address: 'Type B', api: false },
        { item: 6, name: 'NicozDiamond', datecreated: '2022-06-01', address: 'Type C', api: true },
        { item: 7, name: 'Champions', datecreated: '2022-07-01', address: 'Type A', api: true },
        { item: 8, name: 'Allied Insurance', datecreated: '2022-08-01', address: 'Type B', api: false },
        // Add more dummy data items as needed
    ];
    
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
          { key: 'producttype', label: 'Connection Type' },
        ];
    
        return columns.map((column) => (
          <th key={column.key} onClick={() => handleSort(column.key)} className='p-3 text-sm font-bold tracking-wide text-left'>
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

    const handleDelete = (id) => {
      setLoading(true)
      setMessage("Deleting...")
      dispatch(deleteVehicleInsurance({
          id
      }))
      .then((response)=>{
          if(response.payload&&response.payload.success){
            setMessage("Deleted")
          }
          else{
              setLoading(true)
          }            
      })
      .finally(()=>{
        dispatch(fetchCategoryData())
        .then(()=>{
          setLoading(false)
        })
      })
    }
    
    const renderTableRows = () => {
        const sortedDataArray = sortedData();
    
        return sortedDataArray.map((item, index) => (
          <tr key={index} className={`${index%2!==0&&" bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
            <td className='font-bold text-blue-500 justify-center w-24'>{item.item}</td>
            <td>{item.name}</td>
            <td>{item.datecreated}</td>
            <td className=''> <span className={`font-semibold uppercase text-xs tracking-wider ${item.api?" text-green-600 ": " text-yellow-800 "} rounded-md py-1`}>{item.api?"API CONNECTION":"NOT PROVIDED"}</span></td>
          </tr>
        ));
    };

    return (
        <>
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
                    <div className="flex items-center space-x-2">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Insurer
                        </label>
                        <div className="">
                            <select
                                id="systemAdOns"
                                name="systemAdOns"
                                className="border border-gray-300 bg-inherit rounded-xs px-3 py-1.5"
                            >
                                <option v alue="5">First Mutual</option>
                                <option value="10">Credsure</option>
                                <option value="15">Allied Insurance</option>
                                <option value="All">Old Mutual</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='overflow-auto rounded:xl shadow-md'>
                    <table className='w-full'>
                        <thead className='bg-gray-100 border-b-2 border-gray-300'>
                            <tr >{renderTableHeader()}</tr>
                        </thead>
                        <tbody >{renderTableRows()}</tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
