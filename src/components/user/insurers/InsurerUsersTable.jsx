import React, { useEffect, useState } from 'react'
import { deleteInsurerAdmin, fetchAsyncAdmins, fetchAsyncInsurerAdmins, getInsurerUsers, getUsers } from '../../../store/user-store'
import { useDispatch, useSelector } from 'react-redux'
import { navActions } from '../../../store/nav-store'
import { ScaleLoader } from 'react-spinners'
import InsurerUserModal from './InsurerUserModal'
import InsurerUserViewModal from './InsurerUserViewModal'
import InsuranceApi, { setupInterceptors } from '../../api/InsuranceApi'
import useAuth from '../../../hooks/useAuth'

export default function InsurerUsersTable() {

    const {user, setUser} = useAuth()

    const [userResponse, setUserResponse] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [users, setUsers] = useState('')
  
    useEffect(()=>{
      setupInterceptors(() => user, setUser);
      fetchUsers()
    },[])

    const fetchUsers = async () => {
        setLoading(true)
        try{
          const url = user.role==="INSURER_ADMIN"?`/insurer-users/insurer/${user.companyId}` : `/insurer-users`
          const response = await InsuranceApi.get(url)
          console.log(response)
          if(response.data.code==="OK"&&response.data.data){
              setUsers(response.data.data)
          }
        }
        catch(err){
            console.log(err)
            if(err){
                setUserResponse("Error fetching resource, Please check your network connection")
            }
            else if(err){
                setUserResponse("No Users found")
            }
        }
        finally{
          setLoading(false)
        }
    }

    const handleDelete = (id) => {
      setLoading(true)
      setMessage("Deleting...")
      dispatch(deleteInsurerAdmin({
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
        dispatch(fetchAsyncInsurerAdmins())
        .then(()=>{
          setLoading(false)
        })
      })
    }
      
    const renderTableHeader = () => {
      const columns = [
        { key: 'item', label: '#', width: "1" },
        { key: 'firstname', label: 'Firstname' },
        { key: 'lastname', label: 'Lastname' },
        { key: 'email', label: 'Email' },
        { key: 'phoneNumber', label: 'Phone Number' },
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

      if (!users || users.length === 0) {
        return (
            <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>
                    {userResponse || "No Users available."}
                </td>
            </tr>
        );
      }
    
      return users?users.map((item, index) => (
        <tr key={index} className={`${index%2!==0&&" bg-gray-100"} p-3 text-sm text-gray-600 font-semibold`}>
            <td className='font-bold text-blue-5 justify-center items-center w-7'><div className='w-full justify-center flex items-center'>{++index}</div></td>
            <td>{item.firstName}</td>
            <td>{item.lastName}</td>
            <td>{item.email }</td>
            <td>{item.phoneNumber }</td>
            <td className=''><div className='w-full justify-center flex items-center'> <span className={` font-semibold uppercase text-xs tracking-wider px-3 text-white ${item.active?" bg-green-600": " bg-red-600 "} rounded-full py-1`}>{item.active?"Active":"Inactive"}</span></div></td>
            <td className='py-1 space-x-0 justify-center'>
              <div className='w-full justify-center flex items-center'>
                <button
                  onClick={
                    ()=>{
                      setModalData(item)
                      setViewOpen(true)
                    }
                  }
                  className={`space-x-2 items-center border-gray-300 rounded-l-full px-4 h-6 m bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                >
                  <i className='fas fa-eye text-xs'/>
                  <span className='text-xs'>View</span>
                </button>                  
                <button
                  onClick={
                    ()=>{
                      setModalData(item)
                      setIsOpen(true)
                    }
                  }
                  className={`space-x-2 border-gray-300 items-center px-4 h-6 bg-blue-500 text-gray-100 hover:text-blue-500 hover:bg-white`}
                >
                  <i className='fas fa-pen text-xs'/>
                  <span className='text-xs'>Update</span>
                </button>
                <button
                  onClick={
                    ()=>
                      handleDelete(item.id)
                  }
                  className={`space-x-2 border-gray-300 items-center rounded-r-full px-4 h-6 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white`}
                >
                  <i className='fas fa-trash text-xs'/>
                  <span className='text-xs'>Delete</span>
                </button>
              </div>  
            </td>
        </tr>
      )):
      <tr className=''>
        <td colSpan={7} style={{ textAlign: 'center' }}>{userResponse}</td>
      </tr>        
    };

    const getModal =(isOpen)=>{
      setIsOpen(isOpen)
    }
  
    const getViewModal =(isOpen)=>{
      setViewOpen(isOpen)
    }
  
    return (
      <>
        <div className="p-5 bg-white rounded-md border border-gray-200 border-solid border-1">
          {
            isOpen&& <InsurerUserModal setModal={getModal} data={modalData}/>
          }
          {
            viewOpen&& <InsurerUserViewModal setModal={getViewModal} data={modalData}/>
          }
          <h2 className="text-lg font-semibold">Internal Users Table</h2>
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