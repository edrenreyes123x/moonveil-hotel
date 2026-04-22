const Room = require('../models/Room');

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const { name, type, price, description, amenities } = req.body;

    if (!name || !type || !price) {
      return res.status(400).json({ message: 'Name, type, and price are required' });
    }

    const newRoom = await Room.create({
      name,
      type,
      price,
      description,
      amenities: amenities || [],
      available: true,
      bookings: 0
    });

    res.status(201).json({ message: 'Room created successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const { name, type, price, description, amenities, available } = req.body;
    if (name !== undefined) room.name = name;
    if (type !== undefined) room.type = type;
    if (price !== undefined) room.price = price;
    if (description !== undefined) room.description = description;
    if (amenities !== undefined) room.amenities = amenities;
    if (available !== undefined) room.available = available;

    await room.save();
    res.json({ message: 'Room updated successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Error updating room', error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};
