import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check login state on mount and when storage changes
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('userName');
      const role = localStorage.getItem('userRole');
      if (token) {
        setIsLoggedIn(true);
        setUserName(name || '');
        setUserRole(role || 'user');
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
      }
    };

    checkAuth();

    // Listen for storage changes (when login happens in another tab/window)
    window.addEventListener('storage', checkAuth);
    
    // Also listen for custom event when login/logout happens in same window
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('');
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🌙 Moonveil Hotel
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/rooms">Rooms</Link></li>
{isLoggedIn ? (
            <>
              {userRole === 'admin' && (
                <li><Link to="/admin" className="admin-link">Admin Dashboard</Link></li>
              )}
              {userRole === 'staff' && (
                <li><Link to="/staff" className="staff-link">Front Desk</Link></li>
              )}
              {/* Show My Bookings only for customers (non-admin, non-staff) */}
              {userRole === 'user' && (
                <li><Link to="/my-bookings">My Bookings</Link></li>
              )}
              <li className="user-info">👤 {userName}</li>
              <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

