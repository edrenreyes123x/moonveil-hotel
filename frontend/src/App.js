import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import MyBookingsPage from './pages/MyBookingsPage';
import StaffDashboard from './pages/StaffDashboard';
import AdminGuard from './components/AdminGuard';
import StaffGuard from './components/StaffGuard';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const isStaffPage = location.pathname === '/staff';

  return (
    <>
      {!isAdminPage && !isStaffPage && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/booking/:roomId" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
<Route 
          path="/admin" 
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          } 
        />
        <Route 
          path="/staff" 
          element={
            <StaffGuard>
              <StaffDashboard />
            </StaffGuard>
          } 
        />
      </Routes>
{!isAdminPage && !isStaffPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
