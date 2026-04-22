const RoomInstance = require('../models/RoomInstance');
const Room = require('../models/Room');

const getAllRoomInstances = async (req, res) => {
  try {
    const instances = await RoomInstance.find({}).populate('typeId', 'name type price');
    res.json(instances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room instances', error: error.message });
  }
};

const getRoomInstancesByType = async (req, res) => {
  try {
    const instances = await RoomInstance.find({ typeId: req.params.typeId }).populate('typeId');
    res.json(instances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room instances', error: error.message });
  }
};

const getAvailableRoomInstances = async (req, res) => {
  try {
    const instances = await RoomInstance.find({ status: 'Available' }).populate('typeId');
    res.json(instances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available rooms', error: error.message });
  }
};

const createRoomInstance = async (req, res) => {
  try {
    const { typeId, roomNumber } = req.body;
    const roomType = await Room.findById(typeId);
    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }

    const instance = await RoomInstance.create({
      typeId,
      roomNumber,
      typeName: roomType.name,
      price: roomType.price,
      status: 'Available'
    });

    res.status(201).json({ message: 'Room instance created', instance });
  } catch (error) {
    res.status(500).json({ message: 'Error creating room instance', error: error.message });
  }
};

const updateRoomInstance = async (req, res) => {
  try {
    const instance = await RoomInstance.findById(req.params.id);
    if (!instance) {
      return res.status(404).json({ message: 'Room instance not found' });
    }

    const { status } = req.body;
    if (status !== undefined) instance.status = status;

    await instance.save();
    await instance.populate('typeId');
    res.json({ message: 'Room instance updated', instance });
  } catch (error) {
    res.status(500).json({ message: 'Error updating room instance', error: error.message });
  }
};

const deleteRoomInstance = async (req, res) => {
  try {
    const instance = await RoomInstance.findByIdAndDelete(req.params.id);
    if (!instance) {
      return res.status(404).json({ message: 'Room instance not found' });
    }
    res.json({ message: 'Room instance deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room instance', error: error.message });
  }
};

module.exports = {
  getAllRoomInstances,
  getRoomInstancesByType,
  getAvailableRoomInstances,
  createRoomInstance,
  updateRoomInstance,
  deleteRoomInstance
};
