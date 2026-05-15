import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
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

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rooms, setRooms] = useState([]);
  const [roomInstances, setRoomInstances] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddRoom, setShowAddRoom] = useState(false);

  const [newRoom, setNewRoom] = useState({
    name: '',
    type: '',
    price: '',
    description: '',
    amenities: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
        const [roomsRes, instancesRes, bookingsRes, usersRes, paymentRes] = await Promise.all([
          fetch(`${API_URL}/api/rooms`),
          fetch(`${API_URL}/api/room-instances`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(`${API_URL}/api/bookings/admin/all`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(`${API_URL}/api/users`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(`${API_URL}/api/bookings/admin/payments`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

      const roomsData = await roomsRes.json();
      const instancesData = await instancesRes.json();
      const bookingsData = await bookingsRes.json();
      const usersData = await usersRes.json();
      const paymentData = await paymentRes.json();

      setRooms(roomsData);
      setRoomInstances(instancesData);
      setBookings(bookingsData);
      setUsers(usersData);
      setPaymentHistory(paymentData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newRoom,
          amenities: newRoom.amenities.split(',').map(a => a.trim()),
          price: parseFloat(newRoom.price)
        })
      });

      if (response.ok) {
        setShowAddRoom(false);
        setNewRoom({ name: '', type: '', price: '', description: '', amenities: '' });
        fetchData();
        alert('Room added successfully');
      }
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Error adding room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        fetchData();
        alert('Room deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Error deleting room');
    }
  };

  // Room Instance handlers
  const handleUpdateRoomInstanceStatus = async (instanceId, status) => {
    try {
      const response = await fetch(`${API_URL}/api/room-instances/${instanceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchData();
        alert('Room instance status updated');
        return;
      }

      const errorData = await response.json();
      alert(errorData.message || 'Failed to update room instance status');
    } catch (error) {
      console.error('Error updating room instance:', error);
      alert('Network error. Please check if backend server is running.');
    }
  };

const handleDeleteRoomInstance = async (instanceId) => {
    if (!window.confirm('Are you sure you want to delete this room instance?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/room-instances/${instanceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        fetchData();
        alert('Room instance deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting room instance:', error);
      alert('Error deleting room instance');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    navigate('/');
  };

const getUserName = () => {
    return localStorage.getItem('userName') || 'Admin';
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
    <div className="admin-dashboard">
      {/* Sidebar Navigation */}
      <div className="admin-sidebar">
<div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="sidebar-icon">📊</span>
            <span className="sidebar-text">Dashboard</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            <span className="sidebar-icon">🛏️</span>
            <span className="sidebar-text">Rooms ({rooms.length})</span>
          </button>

<button
            className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="sidebar-icon">👥</span>
            <span className="sidebar-text">Users ({users.length})</span>
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <span className="sidebar-icon">💳</span>
            <span className="sidebar-text">Payments</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-user-info">
            <span>Welcome, {getUserName()}</span>
          </div>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-main-content">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
        </div>

        <div className="dashboard-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-overview">
              <h2>Hotel Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
<h3>Total Revenue</h3>
                  <p className="stat-value">₱{paymentHistory?.totalRevenue || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Bookings</h3>
                  <p className="stat-value">{bookings.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Rooms</h3>
                  <p className="stat-value">{rooms.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-value">{users.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Paid Transactions</h3>
                  <p className="stat-value">{paymentHistory?.totalTransactions || 0}</p>
                </div>
                <div className="stat-card stat-pending">
                  <h3>Pending Payments</h3>
                  <p className="stat-value">{paymentHistory?.pendingCount || 0}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="rooms-section">
              <div className="section-header">
                <h2>Room Management</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddRoom(true)}
                >
                  Add New Room
                </button>
              </div>

              {showAddRoom && (
                <div className="add-room-modal">
                  <div className="modal-content">
                    <h3>Add New Room</h3>
                    <form onSubmit={handleAddRoom}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Room Name</label>
                          <input
                            type="text"
                            value={newRoom.name}
                            onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Room Type</label>
                          <select
                            value={newRoom.type}
                            onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                            required
                          >
                            <option value="">Select Type</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Suite">Suite</option>
                            <option value="Penthouse">Penthouse</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
<label>Price per Night (₱)</label>
                        <input
                          type="number"
                          value={newRoom.price}
                          onChange={(e) => setNewRoom({...newRoom, price: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={newRoom.description}
                          onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Amenities (comma-separated)</label>
                        <input
                          type="text"
                          value={newRoom.amenities}
                          onChange={(e) => setNewRoom({...newRoom, amenities: e.target.value})}
                          placeholder="WiFi, AC, Mini Bar"
                          required
                        />
                      </div>
                      <div className="modal-actions">
                        <button type="submit" className="btn btn-primary">Add Room</button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setShowAddRoom(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="rooms-management">
                <div>
<h3>Room Types ({rooms.length})</h3>
                  <div className="rooms-list">
                    {rooms.map(room => {
                      const roomImage = getImageByRoom(room);
                      return (
                        <div key={room._id} className="room-item">
                          <div className="room-image">
                            {roomImage && <img src={roomImage} alt={room.name} />}
                          </div>
                          <div className="room-info">
                            <h3>{room.name}</h3>
                            <p className="room-type">{room.type}</p>
                            <p className="room-price">₱{room.price}/night</p>
<p className="room-bookings">Total Bookings: {room.bookings || 0}</p>
                          </div>
                          <div className="room-actions">
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

<div>
                  <h3>Room Instances ({roomInstances.length})</h3>
                  <div className="rooms-list">
                    {roomInstances.map(instance => (
                      <div key={instance._id} className="room-item">
                        <div className="room-info">
                          <h3>
                            <span className="instance-room-number">{instance.roomNumber}</span>
                            {instance.floor && <span className="instance-floor">Floor {instance.floor}</span>}
                            <span className="instance-type-name">({instance.typeName})</span>
                          </h3>
                          <p className="room-price">₱{instance.price}/night</p>
                          <span className={`status-badge status-${instance.status.toLowerCase()}`}>
                            {instance.status}
                          </span>
                        </div>
                        <div className="room-actions">
                          <select 
                            value={instance.status}
                            onChange={(e) => handleUpdateRoomInstanceStatus(instance._id, e.target.value)}
                            className="status-select"
                          >
                            <option value="Available">Available</option>
                            <option value="Occupied">Occupied</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Not Available">Not Available</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

{activeTab === 'users' && (
            <div className="users-section">
              <h2>User Management</h2>
              <div className="users-list">
                {users.map(user => (
                  <div key={user._id} className="user-item">
                    <div className="user-info">
                      <h3>{user.firstName} {user.lastName}</h3>
                      <p>{user.email}</p>
                      <p className="user-bookings">Bookings: {user.bookings || 0}</p>
                    </div>
                    <div className="user-actions">
                      <button className="btn btn-secondary">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="payments-section">
              <h2>Payment History</h2>
              
              <div className="payment-stats">
                <div className="payment-stat-card">
<h3>Total Revenue</h3>
                  <p className="stat-value">₱{paymentHistory?.totalRevenue || 0}</p>
                </div>
                <div className="payment-stat-card">
                  <h3>Completed Transactions</h3>
                  <p className="stat-value">{paymentHistory?.totalTransactions || 0}</p>
                </div>
                <div className="payment-stat-card stat-pending">
                  <h3>Pending Payments</h3>
                  <p className="stat-value">{paymentHistory?.pendingCount || 0}</p>
                </div>
              </div>

              <div className="payments-list">
                <h3>Transaction History</h3>
                {paymentHistory?.payments && paymentHistory.payments.length > 0 ? (
                  <table className="payments-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Room</th>
                        <th>Guest</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Amount</th>
                        <th>Payment Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.payments.map((payment, index) => (
                        <tr key={index}>
                          <td>{payment.bookingId}</td>
                          <td>{payment.roomName}</td>
                          <td>
                            <div>{payment.guestName}</div>
                            <div className="small-text">{payment.guestEmail}</div>
                          </td>
                          <td>{new Date(payment.checkIn).toLocaleDateString()}</td>
                          <td>{new Date(payment.checkOut).toLocaleDateString()}</td>
<td className="amount">₱{payment.totalPrice}</td>
                          <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}</td>
                          <td>
                            <span className={`status-badge status-${payment.status?.toLowerCase()}`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data">No payment history available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

