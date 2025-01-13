import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sales from './pages/salesPage/Sales';
import Products from './pages/productsPage/Products';
import LoginPage from './pages/login/LoginPage';
import OrganisationalEntities from './pages/organisationalEntities/OrganisationalEntities';
import Insurers from './pages/insurerPage/Insurer';
import InternalUsers from './pages/userManagement/InternalUsers';
import InsurerUsers from './pages/userManagement/InsurerUsers';
import Customers from './pages/userManagement/Customers';
import NotFound from './pages/errorPages/NotFound';
import RegionsPage from './pages/entityManagement/RegionsPage';
import TownsPage from './pages/entityManagement/TownsPage';
import ShopsPage from './pages/entityManagement/ShopsPage';
import Insurance from './pages/productManagement/Insurance';
import InsuranceCategory from './pages/insuranceCategory/InsuranceCategory';
import Dashboard from './pages/homePage/Dashboard';
import RolesPage from './pages/entityManagement/RolesPage';
import Forbidden from './pages/errorPages/Forbidden';
import Layout from './Layout';
import ProtectedRoute from './ProtectedRoute';
import AccountManagement from './pages/userManagement/AccountManagement';
import Reports from './pages/reports/Reports';
import Policy from './pages/Policy/Policy';
import Covernotes from './pages/covernotes/Covernotes';
import Claims from './pages/claims/Claims';
import useAuth from './hooks/useAuth';
import { useColors } from './context/ColorProvider';

function App() {

  const { user } = useAuth();
  const { updateColors } = useColors();

  useEffect(() => {
    if (user) {
      updateColors(user);
    }
  }, [user]);

  return (
    
        <Routes>
          <Route path="/" element={<Layout/>}>
            {/* Public Routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="unauthorized" element={<Forbidden />} />

            {/*All User Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMINISTRATOR', 'SALES_AGENT', 'ADMIN', 'INSURER_ADMIN']}/>}>
              <Route path="insurance" element={<Insurance />} />
              <Route path="insurance-type" element={<InsuranceCategory />} />
              <Route path="profile" element={<AccountManagement />} />
              <Route path="reports" element={<Reports />} />
              <Route path="policy" element={<Policy />} />
            </Route>

            {/*Super Admin, Insurer Admin and System Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMINISTRATOR', 'ADMIN', 'INSURER_ADMIN']}/>}>
              <Route path="insurer-users" element={<InsurerUsers />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="claims" element={<Claims />} />
              <Route path="notes" element={<Covernotes />} />
            </Route>

            {/*Super Admin and System Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMINISTRATOR', 'ADMIN']}/>}>
              <Route path="organisational-entities" element={<OrganisationalEntities />} />
              <Route path="internal-users" element={<InternalUsers />} />
              <Route path="customers" element={<Customers />} />
              <Route path="regions" element={<RegionsPage />} />
              <Route path="towns" element={<TownsPage />} />
              <Route path="shops" element={<ShopsPage />} />
              <Route path="roles" element={<RolesPage />} />
              <Route path="insurers" element={<Insurers />} />
            </Route>

            {/*Super Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMINISTRATOR']}/>}>
            </Route>

            {/*System Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']}/>}>
            </Route>

            {/*Insurer Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['INSURER_ADMIN']}/>}>
            </Route>

            {/*Sales Agent Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SALES_AGENT']}/>}>
              <Route path="sales" element={<Sales />} />
            </Route>

            {/* Catch all Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
  );
}

export default App;