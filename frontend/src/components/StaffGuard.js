import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function StaffGuard({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Check if user is logged in
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is staff
  if (userRole !== 'staff') {
    // Redirect non-staff users to home page
    return <Navigate to="/" replace />;
  }

  return children;
}

export default StaffGuard;
