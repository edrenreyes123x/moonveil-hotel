const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

// Allow mock tokens for testing (when frontend uses mock login)
  // Use real IDs from database: user id 32, admin id 31
  if (token.startsWith('mock-token-')) {
    req.user = { id: 32, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user' };
    return next();
  }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin middleware - checks if user has admin role
const admin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

// Allow mock tokens for testing
    // Use real IDs from database: admin id 31, staff id 35
    if (token.startsWith('mock-token-')) {
      req.user = { id: 31, firstName: 'Admin', lastName: 'User', email: 'admin@moonveil.com', role: 'admin' };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production');
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Staff middleware - checks if user has staff (frontdesk) role
const staff = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

// Allow mock tokens for testing (staff mock)
    // Use real IDs from database: staff id 35
    if (token.startsWith('mock-staff-')) {
      req.user = { id: 35, firstName: 'Sarah', lastName: 'Conner', email: 'staff@moonveil.com', role: 'staff' };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production');
    
    if (decoded.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied. Staff only.' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protect, admin, staff };

