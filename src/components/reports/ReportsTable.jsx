import React, { useState } from 'react'

export default function ReportsTable(props) {

    // const [headers, data] = props

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
    return props.data;
  };

    const renderTableHeader = () => {

        return props.headers.map((column) => (
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

    {props.data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          <td onClick={() => handleCellClick(rowIndex, 'name')}>
            {row.name}
          </td>
          <td onClick={() => handleCellClick(rowIndex, 'age')}>
            {row.age}
          </td>
        </tr>
      ))}

    const renderTableRows = () => {
        const sortedDataArray = sortedData();
        return sortedDataArray.map((item, index) => (
        <tr key={index} className={`${index%2!==0&&" bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
            <td className='font-bold text-blue-500 justify-center w-24'>{item.item}</td>
            <td onClick={() => handleCellClick(index, 'name')}>{item.name}</td>
            <td>{item.datecreated}</td>
            <td>{item.producttype}</td>
        </tr>
        ));
    };

    const handleCellClick = (index, columnName) => {
        setData(prevData => {
            const newData = [...prevData];
            newData[index][columnName] = (
                <input
                type="text"
                defaultValue={prevData[index][columnName]}
                onBlur={event => handleCellBlur(event, index, columnName)}
                />
            );
            return newData;
        });
    };
    
    const handleCellBlur = (event, index, columnName) => {
        const { value } = event.target;
        setData(prevData => {
            const newData = [...prevData];
            newData[index][columnName] = value;
            return newData;
        });
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
                        <tbody >{renderTableRows()}</tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
