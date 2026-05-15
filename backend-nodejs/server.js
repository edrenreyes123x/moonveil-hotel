const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool, initDB } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize PostgreSQL and start server
const startServer = async () => {
  try {
    await initDB();
    console.log('✅ PostgreSQL connected successfully');

// Import Routes
    const authRoutes = require('./routes/authRoutes');
    const roomRoutes = require('./routes/roomRoutes');
    const roomInstanceRoutes = require('./routes/roomInstanceRoutes');
    const bookingRoutes = require('./routes/bookingRoutes');
    const userRoutes = require('./routes/userRoutes');
    const staffRoutes = require('./routes/staffRoutes');

    // Use Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/rooms', roomRoutes);
    app.use('/api/room-instances', roomInstanceRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/staff', staffRoutes);

    // Health Check Route
    app.get('/api/health', async (req, res) => {
      try {
        await pool.query('SELECT 1');
        res.json({ status: 'Server is running', db: 'PostgreSQL connected', timestamp: new Date() });
      } catch (err) {
        res.status(500).json({ status: 'Server running', db: 'PostgreSQL connection failed', error: err.message });
      }
    });

    // 404 Handler
    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });

    // Error Handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    });

    // Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Visit http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

