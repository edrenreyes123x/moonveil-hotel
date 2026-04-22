const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { protect } = require('../middleware/auth');

// Room Routes
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', protect, roomController.createRoom);
router.put('/:id', protect, roomController.updateRoom);
router.delete('/:id', protect, roomController.deleteRoom);

module.exports = router;