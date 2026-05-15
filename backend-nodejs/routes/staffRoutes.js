const express = require('express');
const router = express.Router();
const { staff } = require('../middleware/auth');
const roomController = require('../controllers/roomController');
const roomInstanceController = require('../controllers/roomInstanceController');

// Staff Routes - Protected by staff middleware
// Staff can only view rooms and room instances (read-only access)

// Get all available rooms (staff view)
router.get('/rooms', staff, roomController.getAllRooms);

// Get all room instances (staff view)
router.get('/room-instances', staff, roomInstanceController.getAllRoomInstances);

module.exports = router;
