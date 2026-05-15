import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomCard.css';

function RoomCard({ room }) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    navigate(`/booking/${room._id}`);
  };

  return (
    <div className="room-card">
      <div className="room-image">
        <img src={room.image || 'https://via.placeholder.com/300x200?text=Hotel+Room'} alt={room.name} />
      </div>
      <div className="room-content">
        <h3>{room.name}</h3>
        <p className="room-type">{room.type}</p>
        <p className="room-description">{room.description}</p>
        
        <div className="room-amenities">
          <strong>Amenities:</strong>
          <ul>
            {room.amenities && room.amenities.map((amenity, idx) => (
              <li key={idx}>✓ {amenity}</li>
            ))}
          </ul>
        </div>

        <div className="room-footer">
          <div className="price">
            <span className="price-label">Per Night:</span>
          <span className="price-value">₱{room.price}</span>
          </div>
          <button className="btn btn-primary" onClick={handleBookNow}>
            Book Now
          </button>
        </div>

        <div className="room-rating">
          <span>⭐ {room.rating || 'No ratings'}</span>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;