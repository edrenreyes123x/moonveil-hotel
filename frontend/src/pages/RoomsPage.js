import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';
import './RoomsPage.css';
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
  return images[room.name] || room.image || 'https://via.placeholder.com/300x200?text=Hotel+Room';
}

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: 500,
    roomType: 'all',
    sortBy: 'price'
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/rooms`);
      const data = await response.json();
      const roomsWithImages = data.map(room => ({
        ...room,
        image: getImageByRoom(room)
      }));
      setRooms(roomsWithImages);
      setFilteredRooms(roomsWithImages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      const mockRooms = [
        {
          _id: '1',
          name: 'Deluxe Room',
          type: 'Double',
          price: 150,
          description: 'Spacious room with stunning city view',
          amenities: ['WiFi', 'AC', 'Mini Bar', 'Bathtub'],
          rating: 4.5,
          image: deluxeImg
        },
        {
          _id: '2',
          name: 'Suite Room',
          type: 'Suite',
          price: 300,
          description: 'Luxury suite with separate living area',
          amenities: ['WiFi', 'AC', 'Jacuzzi', 'Safe', 'Smart TV'],
          rating: 4.8,
          image: suiteImg
        },
        {
          _id: '3',
          name: 'Standard Room',
          type: 'Single',
          price: 80,
          description: 'Comfortable room perfect for solo travelers and budget-conscious guests',
          amenities: ['WiFi', 'AC', 'Shower'],
          rating: 4.2,
          image: standardImg
        },
        {
          _id: '4',
          name: 'Penthouse',
          type: 'Penthouse',
          price: 500,
          description: 'Ultimate luxury experience with panoramic views',
          amenities: ['WiFi', 'AC', 'Infinity Pool', 'Concierge', 'Spa'],
          rating: 5.0,
          image: penthouseImg
        }
      ];
      setRooms(mockRooms);
      setFilteredRooms(mockRooms);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (filtersToApply) => {
    let filtered = rooms.filter(room => room.price <= parseInt(filtersToApply.priceRange));

    if (filtersToApply.roomType !== 'all') {
      filtered = filtered.filter(room => room.type.toLowerCase() === filtersToApply.roomType.toLowerCase());
    }

    if (filtersToApply.sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filtersToApply.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredRooms(filtered);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading rooms...</p>
      </div>
    );
  }

  return (
    <div className="rooms-page">
      <div className="container">
        <h1>Our Rooms</h1>
        
        <div className="rooms-content">
          <aside className="filters-sidebar">
            <h3>Filters</h3>
            
            <div className="filter-group">
              <label>Price Range: ${filters.priceRange}</label>
              <input 
                type="range" 
                name="priceRange" 
                min="0" 
                max="500" 
                value={filters.priceRange}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Room Type</label>
              <select name="roomType" value={filters.roomType} onChange={handleFilterChange}>
                <option value="all">All Types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                <option value="price">Price (Low to High)</option>
                <option value="rating">Rating (High to Low)</option>
              </select>
            </div>

            <button className="btn btn-secondary" onClick={fetchRooms}>
              Reset Filters
            </button>
          </aside>

          <div className="rooms-grid">
            {filteredRooms.length > 0 ? (
              filteredRooms.map(room => (
                <RoomCard key={room._id} room={room} />
              ))
            ) : (
              <p className="no-results">No rooms match your criteria</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomsPage;

