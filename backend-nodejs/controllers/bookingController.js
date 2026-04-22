const Booking = require('../models/Booking');
const User = require('../models/User');

// Get all bookings (user filtered)
const getAllBookings = async (req, res) => {
  try {
    const userBookings = await Booking.find({ userId: req.user.id }).populate('roomId', 'name type price');
    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get all bookings (admin)
const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('userId', 'firstName lastName email').populate('roomId', 'name type price');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get payment history (admin)
const getPaymentHistory = async (req, res) => {
  try {
    const paidBookings = await Booking.find({ paymentStatus: 'Paid' }).populate('userId', 'firstName lastName email').populate('roomId', 'name');
    
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const pendingPayments = await Booking.countDocuments({ paymentStatus: 'Pending' });
    
    const paymentHistory = paidBookings.map(booking => ({
      bookingId: booking._id,
      roomName: booking.roomId ? booking.roomId.name : booking.roomName,
      guestName: booking.userId ? `${booking.userId.firstName} ${booking.userId.lastName}` : booking.guestName,
      guestEmail: booking.userId ? booking.userId.email : booking.guestEmail,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalPrice: booking.totalPrice,
      paymentDate: booking.paymentDate,
      status: booking.status,
      paymentMethod: booking.paymentMethod
    }));

    res.json({
      totalRevenue,
      totalTransactions: paidBookings.length,
      pendingCount: pendingPayments,
      payments: paymentHistory
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment history', error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id }).populate('roomId', 'name type price');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, specialRequests, totalPrice, roomName, paymentMethod } = req.body;

if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Dates required' });
    }


    const guestName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Guest';
    const guestEmail = req.user.email || '';

    const newBooking = await Booking.create({
      userId: req.user.id,
      roomId,
      roomName: roomName || 'Room',
      guestName,
      guestEmail,
      checkIn,
      checkOut,
      guests: guests || 1,
      specialRequests: specialRequests || '',
      totalPrice: totalPrice || 0,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod,
      paymentDate: new Date()
    });

    res.status(201).json({ message: 'Payment successful! Booking confirmed.', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const { checkIn, checkOut, guests, specialRequests, status } = req.body;
    if (checkIn !== undefined) booking.checkIn = checkIn;
    if (checkOut !== undefined) booking.checkOut = checkOut;
    if (guests !== undefined) booking.guests = guests;
    if (specialRequests !== undefined) booking.specialRequests = specialRequests;
    if (status !== undefined) booking.status = status;

    await booking.save();
    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

const updateBookingAdmin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const { checkIn, checkOut, guests, specialRequests, status, paymentStatus, totalPrice } = req.body;
    if (checkIn !== undefined) booking.checkIn = checkIn;
    if (checkOut !== undefined) booking.checkOut = checkOut;
    if (guests !== undefined) booking.guests = guests;
    if (specialRequests !== undefined) booking.specialRequests = specialRequests;
    if (status !== undefined) booking.status = status;
    if (paymentStatus !== undefined) booking.paymentStatus = paymentStatus;
    if (totalPrice !== undefined) booking.totalPrice = totalPrice;

    // Validate business logic for status changes to Completed
    if (status === 'Completed') {
      const now = new Date();
      if (now < booking.checkOut) {
        return res.status(400).json({ message: 'Cannot complete future booking. Checkout date must have passed.' });
      }
      if (booking.paymentStatus !== 'Paid') {
        return res.status(400).json({ message: 'Cannot complete unpaid booking. Payment must be marked as Paid first.' });
      }
    }

    await booking.save();
    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    console.error('Booking update error for booking ID:', req.params.id, error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ');
      res.status(400).json({ message: 'Validation error updating booking', details: messages });
    } else {
      res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
  }

};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};

const deleteBookingAdmin = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};

module.exports = {
  getAllBookings,
  getAllBookingsAdmin,
  getPaymentHistory,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingAdmin,
  deleteBooking,
  deleteBookingAdmin
};

