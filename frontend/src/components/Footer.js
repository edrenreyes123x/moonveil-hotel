import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Moonveil Hotel</h3>
          <p>Experience luxury and comfort at our world-class hotel.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/rooms">Rooms</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>📧 info@moonveilhotel.com</p>
          <p>📞 +1 (555) 123-4567</p>
          <p>📍 123 Moonlight Street, Cagayan De Oro City, Philippines</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Moonveil Hotel. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;