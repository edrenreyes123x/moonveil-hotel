import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPages.css';
import { API_URL } from '../services/api';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      console.log('Login response:', data);

      // Store user data including role in localStorage - use real IDs from backend
      const token = data.token || data.token;
      const userId = data.user?._id || data.user?.id;
      const userName = data.user?.firstName || formData.email.split('@')[0];
      const userRole = data.user?.role || 'user';
      
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userId', String(userId || ''));

      console.log('Stored userId:', userId, 'role:', userRole);

      // Notify navbar of auth change
      window.dispatchEvent(new Event('authChange'));

      // Redirect to admin dashboard if admin, otherwise to home
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      setLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login to Moonveil Hotel</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        

      </div>
    </div>
  );
}

export default LoginPage;
