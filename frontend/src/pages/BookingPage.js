import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingPage.css';
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

function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: ''
  });

  const [paymentData, setPaymentData] = useState({
    method: 'gcash'
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchRoom();
  }, [roomId, navigate]);

  useEffect(() => {
    if (room && bookingData.checkIn && bookingData.checkOut) {
      calculateTotalPrice();
    }
  }, [room, bookingData.checkIn, bookingData.checkOut]);

  const fetchRoom = async () => {
    try {
      const response = await fetch(`${API_URL}/api/rooms/${roomId}`);
      if (!response.ok) {
        throw new Error('Room not found');
      }
      let data = await response.json();
      data = {
        ...data,
        image: getImageByRoom(data)
      };
      setRoom(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching room:', error);
      const mockRooms = {
        '1': {
          _id: '1',
          name: 'Deluxe Room',
          type: 'Double',
          price: 150,
          description: 'Spacious room with stunning city view',
          amenities: ['WiFi', 'AC', 'Mini Bar', 'Bathtub'],
          image: deluxeImg
        },
        '2': {
          _id: '2',
          name: 'Suite Room',
          type: 'Suite',
          price: 300,
          description: 'Luxury suite with separate living area',
          amenities: ['WiFi', 'AC', 'Jacuzzi', 'Safe', 'Smart TV'],
          image: suiteImg
        },
        '3': {
          _id: '3',
          name: 'Standard Room',
          type: 'Single',
          price: 80,
          description: 'Comfortable room perfect for solo travelers and budget-conscious guests',
          amenities: ['WiFi', 'AC', 'Shower'],
          image: standardImg
        },
        '4': {
          _id: '4',
          name: 'Penthouse',
          type: 'Penthouse',
          price: 500,
          description: 'Ultimate luxury experience with panoramic views',
          amenities: ['WiFi', 'AC', 'Infinity Pool', 'Concierge', 'Spa'],
          image: penthouseImg
        }
      };
      setRoom(mockRooms[roomId] || mockRooms['1']);
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotalPrice(diffDays * room.price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const validateBooking = () => {
    setError('');
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setError('Please select check-in and check-out dates');
      return false;
    }
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkIn < today) {
      setError('Check-in date cannot be in the past');
      return false;
    }
    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      return false;
    }
    calculateTotalPrice();
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateBooking()) return;
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          roomId: room._id,
          roomName: room.name,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          specialRequests: bookingData.specialRequests,
          totalPrice,
          paymentMethod: paymentData.method
        })
      });

      const data = await response.json();

      console.log('Booking response:', response.status, data); // Debug log

      if (!response.ok) {
        // Show detailed backend error
        setError(data.message || data.error || 'Booking failed. Please check dates, availability, or try another payment method.');
        setSubmitting(false);
        return;
      }

      alert('Payment successful! Booking confirmed.');
      setError('');
      navigate('/my-bookings');
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Booking failed. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="error-page">
        <h1>Room Not Found</h1>
        <p>The room you're looking for doesn't exist.</p>
        <a href="/rooms" className="btn btn-primary">Back to Rooms</a>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        <h1>Book Your Stay</h1>

        <div className="booking-content">
          <div className="room-summary">
            <div className="room-image">
              <img src={room.image} alt={room.name} />
            </div>
            <div className="room-details">
              <h2>{room.name}</h2>
              <p className="room-type">{room.type}</p>
              <p className="room-description">{room.description}</p>
              <div className="room-amenities">
                <strong>Amenities:</strong>
                <ul>
                  {room.amenities.map((amenity, idx) => (
                    <li key={idx}>✓ {amenity}</li>
                  ))}
                </ul>
              </div>
              <div className="price-info">
                <span className="price">₱{room.price} per night</span>
              </div>
            </div>
          </div>

          <div className="booking-form-container">
            <h3>Booking Details</h3>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="checkIn">Check-in Date</label>
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="checkOut">Check-out Date</label>
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={handleInputChange}
                    min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="guests">Number of Guests</label>
                <select
                  id="guests"
                  name="guests"
                  value={bookingData.guests}
                  onChange={handleInputChange}
                  required
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="specialRequests">Special Requests (Optional)</label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={bookingData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requests or notes..."
                  rows={4}
                />
              </div>

              {totalPrice > 0 && (
                <div className="price-summary">
                  <h4>Price Summary</h4>
                  <div className="price-breakdown">
                    <div className="price-item">
                      <span>₱{room.price} × {Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24))} nights</span>
                      <span>₱{totalPrice}</span>
                    </div>
                    <div className="price-total">
<span>Total:</span>
                      <span className="total-amount">₱{totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method Selection - Design Only */}
              <div className="payment-methods">
                <h4>Choose Payment Method</h4>
                <div className="method-options">
                  <label className="method-option">
                    <input
                      type="radio"
                      name="method"
                      value="gcash"
                      checked={paymentData.method === 'gcash'}
                      onChange={handlePaymentChange}
                    />
                    <div className="method-icon">GCash</div>
                  </label>
                  <label className="method-option">
                    <input
                      type="radio"
                      name="method"
                      value="visa"
                      checked={paymentData.method === 'visa'}
                      onChange={handlePaymentChange}
                    />
                    <div className="method-icon">Visa</div>
                  </label>
                  <label className="method-option">
                    <input
                      type="radio"
                      name="method"
                      value="mastercard"
                      checked={paymentData.method === 'mastercard'}
                      onChange={handlePaymentChange}
                    />
                    <div className="method-icon">Mastercard</div>
                  </label>
                  <label className="method-option">
                    <input
                      type="radio"
                      name="method"
                      value="paypal"
                      checked={paymentData.method === 'paypal'}
                      onChange={handlePaymentChange}
                    />
                    <div className="method-icon">PayPal</div>
                  </label>
                  <label className="method-option">
                    <input
                      type="radio"
                      name="method"
                      value="cash"
                      checked={paymentData.method === 'cash'}
                      onChange={handlePaymentChange}
                    />
                    <div className="method-icon">Cash</div>
                  </label>
                </div>
              </div>

              {paymentData.method === 'gcash' && (
                <div className="payment-details">
                  <p>GCash payment of ₱{totalPrice} will be processed securely.</p>
                </div>
              )}

              {['visa', 'mastercard'].includes(paymentData.method) && (
                <div className="payment-details">
                  <p>Card payment of ₱{totalPrice} will be processed securely.</p>
                </div>
              )}

              {paymentData.method === 'paypal' && (
                <div className="payment-details">
                  <p>PayPal payment of ₱{totalPrice} will be processed securely.</p>
                </div>
              )}

              {paymentData.method === 'cash' && (
                <div className="payment-details">
                  <p>Payment on arrival (Cash).</p>
                </div>
              )}

              <div className="price-summary">
                <h4>Total: ₱{totalPrice}</h4>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Completing Booking...' : 'Complete Booking Securely'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
