const Room = require('../models/Room');

const formatRoom = (room) => ({
  _id: room.id,
  name: room.name,
  type: room.type,
  price: parseFloat(room.price),
  description: room.description,
  amenities: room.amenities || [],
  image: room.image,
  rating: parseFloat(room.rating),
  available: room.available,
  bookings: room.bookings,
  createdAt: room.created_at,
  updatedAt: room.updated_at
});

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms.map(formatRoom));
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
    res.json(formatRoom(room));
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

    res.status(201).json({ message: 'Room created successfully', room: formatRoom(newRoom) });
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
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (type !== undefined) updates.type = type;
    if (price !== undefined) updates.price = price;
    if (description !== undefined) updates.description = description;
    if (amenities !== undefined) updates.amenities = amenities;
    if (available !== undefined) updates.available = available;

    const updatedRoom = await Room.update(req.params.id, updates);
    res.json({ message: 'Room updated successfully', room: formatRoom(updatedRoom) });
  } catch (error) {
    res.status(500).json({ message: 'Error updating room', error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.deleteById(req.params.id);
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

