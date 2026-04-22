const express = require('express');
const router = express.Router();
const roomInstanceController = require('../controllers/roomInstanceController');
const { protect, admin } = require('../middleware/auth');

// Admin-only room instance routes
router.get('/', protect, roomInstanceController.getAllRoomInstances);
router.get('/available', protect, roomInstanceController.getAvailableRoomInstances);
router.get('/type/:typeId', protect, roomInstanceController.getRoomInstancesByType);
router.post('/', protect, admin, roomInstanceController.createRoomInstance);
router.put('/:id', protect, admin, roomInstanceController.updateRoomInstance);
router.delete('/:id', protect, admin, roomInstanceController.deleteRoomInstance);

module.exports = router;
