const RoomInstance = require('../models/RoomInstance');
const Room = require('../models/Room');

const formatInstance = (instance) => ({
  _id: instance.id,
  typeId: instance.type_id,
  roomNumber: instance.room_number,
  floor: instance.floor,
  status: instance.status,
  typeName: instance.type_name,
  price: parseFloat(instance.price),
  createdAt: instance.created_at,
  updatedAt: instance.updated_at,
  typeId: instance.type_id ? {
    _id: instance.type_id,
    name: instance.room_name,
    type: instance.room_type,
    price: parseFloat(instance.room_price)
  } : undefined
});

const getAllRoomInstances = async (req, res) => {
  try {
    const instances = await RoomInstance.findAll();
    res.json(instances.map(formatInstance));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room instances', error: error.message });
  }
};

const getRoomInstancesByType = async (req, res) => {
  try {
    const instances = await RoomInstance.findByTypeId(req.params.typeId);
    res.json(instances.map(formatInstance));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room instances', error: error.message });
  }
};

const getAvailableRoomInstances = async (req, res) => {
  try {
    const instances = await RoomInstance.findAvailable();
    res.json(instances.map(formatInstance));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available rooms', error: error.message });
  }
};

const createRoomInstance = async (req, res) => {
  try {
    const { typeId, roomNumber, floor } = req.body;
    const roomType = await Room.findById(typeId);
    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }

    const instance = await RoomInstance.create({
      typeId,
      roomNumber,
      floor,
      typeName: roomType.name,
      price: roomType.price,
      status: 'Available'
    });

    const fullInstance = await RoomInstance.findById(instance.id);
    res.status(201).json({ message: 'Room instance created', instance: formatInstance(fullInstance) });
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
    const updates = {};
    if (status !== undefined) updates.status = status;

    const updatedInstance = await RoomInstance.update(req.params.id, updates);
    const fullInstance = await RoomInstance.findById(updatedInstance.id);
    res.json({ message: 'Room instance updated', instance: formatInstance(fullInstance) });
  } catch (error) {
    res.status(500).json({ message: 'Error updating room instance', error: error.message });
  }
};

const deleteRoomInstance = async (req, res) => {
  try {
    const instance = await RoomInstance.deleteById(req.params.id);
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

