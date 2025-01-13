import React, { useState } from 'react'
import SideBar from '../../components/navigation/sideBar/SideBar';
import TopBar from '../../components/navigation/topBar/TopBar';
import useAuth from '../../hooks/useAuth';
import AdminDashboard from '../../components/dashboard/admin/AdminDashboard';
import InsurerDashboard from '../../components/dashboard/insurer/InsurerDashboard';
import DisplayLayout from '../../components/Layout/DisplayLayout';

export default function Dashboard() {  

  const {user} = useAuth()
  const userRole = user.role

  return (
    <>
      <DisplayLayout>
        {
          ( userRole === "ADMIN" || userRole === "SUPER_ADMINISTRATOR" ) && <AdminDashboard/>
        }
        {
          userRole === "INSURER_ADMIN" && <InsurerDashboard/>
        }
      </DisplayLayout>
    </>
  )
}
