import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  // Check if the user's role matches any of the allowed roles
  const isAuthorized = user && allowedRoles.includes(user.role);

  if (!user) {
    // User is not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    // User is logged in but not authorized
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User is logged in and authorized
  return <Outlet />;
};

export default ProtectedRoute;