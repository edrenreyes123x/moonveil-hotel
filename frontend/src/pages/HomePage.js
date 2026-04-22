import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Moonveil Hotel</h1>
          <p>Experience luxury, comfort, and unforgettable memories</p>
          <Link to="/rooms" className="btn btn-primary hero-btn">
            Explore Rooms
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features container">
        <h2>Why Choose Moonveil?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏨</div>
            <h3>Luxury Rooms</h3>
            <p>Experience comfort with our state-of-the-art amenities and elegant designs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🍽️</div>
            <h3>Fine Dining</h3>
            <p>Enjoy world-class cuisine prepared by our expert chefs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏊</div>
            <h3>Premium Facilities</h3>
            <p>Relax and rejuvenate with our spa, pool, and fitness center.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>24/7 Support</h3>
            <p>Our dedicated team is always ready to assist you.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready for Your Perfect Stay?</h2>
        <p>Book your room today and get 10% discount on your first booking!</p>
        <Link to="/rooms" className="btn btn-primary">
          Browse Available Rooms
        </Link>
      </section>
    </div>
  );
}

export default HomePage;