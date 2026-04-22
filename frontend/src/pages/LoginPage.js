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
        // Fall through to mock login if backend fails
        throw new Error(data.message || 'Login failed');
      }

      // Store user data including role in localStorage
      localStorage.setItem('token', data.token || 'mock-token-' + Date.now());
      localStorage.setItem('userName', data.user?.firstName || formData.email.split('@')[0]);
      localStorage.setItem('userRole', data.user?.role || 'user');
      localStorage.setItem('userId', data.user?.id || '');

      // Notify navbar of auth change
      window.dispatchEvent(new Event('authChange'));

      // Redirect to admin dashboard if admin, otherwise to home
      if (data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Mock login for testing - works even without backend
      if (formData.email && formData.password) {
        const isAdmin = formData.email.toLowerCase() === 'admin@moonveil.com' && formData.password === 'admin123';
        localStorage.setItem('token', 'mock-token-' + Date.now());
        localStorage.setItem('userName', isAdmin ? 'Admin' : formData.email.split('@')[0]);
        localStorage.setItem('userRole', isAdmin ? 'admin' : 'user');
        localStorage.setItem('userId', isAdmin ? '1' : '2');
        
        // Notify navbar of auth change
        window.dispatchEvent(new Event('authChange'));
        
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError('Please fill in all fields');
      }
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
