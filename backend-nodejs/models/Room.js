const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  amenities: [{
    type: String
  }],
  image: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  bookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
