import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css';
import { API_URL } from '../services/api';
import deluxeImg from '../assets/rooms/deluxe.jpg';
import suiteImg from '../assets/rooms/suite.jpg';
import standardImg from '../assets/rooms/standard.jpg';
import penthouseImg from '../assets/rooms/penthouse.jpg';

function getImageByRoom(room) {
  const images = {
    'Deluxe Room': deluxeImg,
    'Suite Room': suiteImg,
    'Standard Room': standardImg,
    'Penthouse': penthouseImg
  };
  return images[room.name] || null;
}

function StaffDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [roomInstances, setRoomInstances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (userRole !== 'staff') {
      navigate('/');
      return;
    }
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [roomsRes, instancesRes] = await Promise.all([
        fetch(`${API_URL}/api/staff/rooms`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${API_URL}/api/staff/room-instances`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const roomsData = await roomsRes.json();
      const instancesData = await instancesRes.json();

      setRooms(roomsData);
      setRoomInstances(instancesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const getUserName = () => {
    return localStorage.getItem('userName') || 'Staff';
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'status-available';
      case 'occupied':
        return 'status-occupied';
      case 'maintenance':
        return 'status-maintenance';
      default:
        return 'status-default';
    }
  };

  const countAvailableRooms = () => {
    return roomInstances.filter(instance => 
      instance.status?.toLowerCase() === 'available'
    ).length;
  };

  const countOccupiedRooms = () => {
    return roomInstances.filter(instance => 
      instance.status?.toLowerCase() === 'occupied'
    ).length;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      {/* Sidebar Navigation */}
      <div className="staff-sidebar">
        <div className="sidebar-header">
          <h2>Front Desk</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-btn ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            <span className="sidebar-icon">🛏️</span>
            <span className="sidebar-text">Rooms ({rooms.length})</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'room-instances' ? 'active' : ''}`}
            onClick={() => setActiveTab('room-instances')}
          >
            <span className="sidebar-icon">🚪</span>
            <span className="sidebar-text">Room Units ({roomInstances.length})</span>
          </button>
        </nav>
<div className="sidebar-footer">
          <div className="staff-user-info">
            <span>Welcome, {getUserName()}</span>
          </div>
          <button className="btn btn-home" onClick={handleGoHome}>
            🏠 Home
          </button>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="staff-main-content">
        <div className="staff-header">
          <h1>Front Desk Dashboard</h1>
          <p className="staff-subtitle">View room information only</p>
        </div>

        <div className="staff-content">
          {activeTab === 'rooms' && (
            <div className="rooms-section">
              <h2>Room Types</h2>
              
              {/* Quick Stats */}
              <div className="quick-stats">
                <div className="stat-card">
                  <h3>Total Rooms</h3>
                  <p className="stat-value">{rooms.length}</p>
                </div>
                <div className="stat-card stat-available">
                  <h3>Available</h3>
                  <p className="stat-value">{countAvailableRooms()}</p>
                </div>
                <div className="stat-card stat-occupied">
                  <h3>Occupied</h3>
                  <p className="stat-value">{countOccupiedRooms()}</p>
                </div>
              </div>

<div className="rooms-list">
                {rooms.map(room => {
                  const roomImage = getImageByRoom(room);
                  return (
                    <div key={room._id} className="room-card">
                      <div className="room-image">
                        {roomImage ? (
                          <img src={roomImage} alt={room.name} className="room-img" />
                        ) : (
                          <span className="room-icon">🛏️</span>
                        )}
                      </div>
                      <div className="room-info">
                        <h3>{room.name}</h3>
                        <p className="room-type">Type: {room.type}</p>
<p className="room-price">₱{room.price}/night</p>
                        <p className="room-description">{room.description}</p>
                        <div className="room-amenities">
                          <strong>Amenities:</strong>
                          <div className="amenities-list">
                            {room.amenities?.map((amenity, index) => (
                              <span key={index} className="amenity-tag">{amenity}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'room-instances' && (
            <div className="room-instances-section">
              <h2>Room Units</h2>
              
              <div className="instances-list">
                {roomInstances.map(instance => (
                  <div key={instance._id} className="instance-card">
                    <div className="instance-info">
                      <h3>Room {instance.roomNumber}</h3>
                      <p className="instance-type">Type: {instance.typeName}</p>
<p className="instance-price">₱{instance.price}/night</p>
                    </div>
                    <div className="instance-status">
                      <span className={`status-badge ${getStatusBadgeClass(instance.status)}`}>
                        {instance.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
