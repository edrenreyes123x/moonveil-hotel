import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function AdminGuard({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Check if user is logged in
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin
  if (userRole !== 'admin') {
    // Redirect regular users to home page
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminGuard;

