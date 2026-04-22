const mongoose = require('mongoose');

const roomInstanceSchema = new mongoose.Schema({
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance', 'Not Available'],
    default: 'Available'
  },
  typeName: String, // Denormalized for quick display
  price: Number
}, {
  timestamps: true
});

const RoomInstance = mongoose.model('RoomInstance', roomInstanceSchema);

module.exports = RoomInstance;
