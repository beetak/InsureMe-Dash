import React, { useEffect, useState } from 'react'
import { fetchAsyncRoles, getRoles } from '../../../store/user-store';
import { useDispatch, useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';

export default function RolesTable() {

    const [roleResponse, setRoleResponse] = useState('')
    const [loading, setLoading] = useState(false)
    
    const dispatch = useDispatch()
  
    useEffect(()=>{
        setLoading(true)
        dispatch(fetchAsyncRoles())
        .then((res)=>{
            setLoading(false)
            if(!res.success){
                setRoleResponse("Error fetching resource, Please check your network connection")
            }
            else if(res.success&&!res.data){
                setRoleResponse("No Categories found")
            }
        })
        .finally(()=>{
            setLoading(false)
        })
    },[dispatch])

    const roles = useSelector(getRoles)

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

    const renderTableHeader = () => {
        const columns = [
            { key: 'item', label: '#', width: 1 },
            { key: 'name', label: 'Role Type' },
            { key: 'datecreated', label: 'Date Created' },
            { key: 'status', label: 'Status' },
            { key: 'action', label: 'Action' },
        ];

        return columns.map((column) => (
            <th key={column.key} className={`text-sm font-bold tracking-wide text-left ${column.width ? "p-3 w-" + column.width : "py-3"} ${column.key === 'status' && "text-center"} ${column.key === 'action' && "text-center"}`}>
              <span className="mr-2">{column.label}</span>            
            </th>
        ));
    };

    const loadingAnimation = () => {
        return <tr>
            <td colSpan={7} style={{ textAlign: 'center' }} className='py-3'>
                <ScaleLoader
                    color='#374151'
                    loading={loading}
                    cssOverride={override}
                    size={10} // Adjust the size as needed
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
                <h1 className='flex text-gray-700 justify-center'>Loading</h1>
            </td>
        </tr>
      }
    

    const renderTableRows = () => {
        return roles.data?roles.data.data.map((item, index) => (
            <tr key={index} className={`${index%2!==0&&" bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
                <td className='font-bold text-blue-500 justify-center w-24'>{item.item}</td>
                <td onClick={() => handleCellClick(index, 'name')}>{item.name}</td>
                <td>{item.datecreated}</td>
                <td>{item.producttype}</td>
            </tr>
        )):
        <tr className=''>
          <td colSpan={7} style={{ textAlign: 'center' }}>{roleResponse}</td>
        </tr>
    };

    return (
        <>
            <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
                <h2 className="text-lg font-semibold">Role Data</h2>
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
                <div className='overflow-auto rounded:xl shadow-md'>
                    <table className='w-full'>
                        <thead className='bg-gray-100 border-b-2 border-gray-300'>
                            <tr >{renderTableHeader()}</tr>
                        </thead>
                        <tbody >{loading?loadingAnimation():renderTableRows()}</tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
}