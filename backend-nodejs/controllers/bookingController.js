const Booking = require('../models/Booking');
const User = require('../models/User');

const formatBooking = (booking) => ({
  _id: booking.id,
  userId: booking.user_id,
  roomId: booking.room_id,
  roomInstanceId: booking.room_instance_id,
  roomName: booking.room_name,
  roomNumber: booking.room_number,
  floor: booking.floor,
  guestName: booking.guest_name,
  guestEmail: booking.guest_email,
  checkIn: booking.check_in,
  checkOut: booking.check_out,
  guests: booking.guests,
  specialRequests: booking.special_requests,
  totalPrice: parseFloat(booking.total_price),
  status: booking.status,
  paymentStatus: booking.payment_status,
  paymentMethod: booking.payment_method,
  paymentDate: booking.payment_date,
  createdAt: booking.created_at,
  updatedAt: booking.updated_at,
  roomId: booking.room_id ? {
    _id: booking.room_id,
    name: booking.room_name,
    type: booking.room_type,
    price: parseFloat(booking.room_price)
  } : undefined,
  userId: booking.user_id ? {
    _id: booking.user_id,
    firstName: booking.user_first_name,
    lastName: booking.user_last_name,
    email: booking.user_email
  } : undefined
});

// Get all bookings (user filtered)
const getAllBookings = async (req, res) => {
  try {
    const userBookings = await Booking.findByUserId(req.user.id);
    res.json(userBookings.map(formatBooking));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get all bookings (admin)
const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.json(bookings.map(formatBooking));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get payment history (admin)
const getPaymentHistory = async (req, res) => {
  try {
    const paidBookings = await Booking.findPaid();
    const totalRevenue = paidBookings.reduce((sum, b) => sum + parseFloat(b.total_price), 0);
    const pendingPayments = await Booking.countPendingPayments();

    const paymentHistory = paidBookings.map(booking => ({
      bookingId: booking.id,
      roomName: booking.room_name,
      roomNumber: booking.room_number || 'Not assigned',
      floor: booking.floor || 'N/A',
      guestName: booking.user_first_name ? `${booking.user_first_name} ${booking.user_last_name}` : booking.guest_name,
      guestEmail: booking.user_email || booking.guest_email,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      totalPrice: parseFloat(booking.total_price),
      paymentDate: booking.payment_date,
      status: booking.status,
      paymentMethod: booking.payment_method
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
    const booking = await Booking.findByIdAndUserId(req.params.id, req.user.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(formatBooking(booking));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

const Room = require('../models/Room');

const createBooking = async (req, res) => {
  try {
    const { roomId: roomIdStr, checkIn, checkOut, guests, specialRequests, totalPrice, roomName, paymentMethod } = req.body;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Dates required' });
    }

    const roomId = parseInt(roomIdStr);
    const userId = req.user.id;

    if (!userId || !roomId) {
      return res.status(400).json({ message: 'User ID and Room ID required' });
    }
    console.log(`Creating booking - user: ${userId}, room: ${roomName || 'Deluxe'} (${roomId})`);

    const guestName = `${req.user.firstName || 'Guest'} ${req.user.lastName || ''}`.trim() || 'Guest';
    const guestEmail = req.user.email || 'guest@example.com';

    const newBooking = await Booking.create({
      userId,
      roomId,
      roomName: roomName || 'Deluxe Room',
      guestName,
      guestEmail,
      checkIn,
      checkOut,
      guests: guests || 1,
      specialRequests: specialRequests || '',
      totalPrice: totalPrice || 0,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod: paymentMethod || 'cash',
      paymentDate: new Date()
    });

    const fullBooking = await Booking.findById(newBooking.id);
    res.status(201).json({ message: 'Payment successful! Booking confirmed.', booking: formatBooking(fullBooking) });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: error.message || 'Error creating booking' });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUserId(req.params.id, req.user.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const { checkIn, checkOut, guests, specialRequests, status } = req.body;
    const updates = {};
    if (checkIn !== undefined) updates.checkIn = checkIn;
    if (checkOut !== undefined) updates.checkOut = checkOut;
    if (guests !== undefined) updates.guests = guests;
    if (specialRequests !== undefined) updates.specialRequests = specialRequests;
    if (status !== undefined) updates.status = status;

    const updatedBooking = await Booking.update(req.params.id, updates);
    const fullBooking = await Booking.findById(updatedBooking.id);
    res.json({ message: 'Booking updated successfully', booking: formatBooking(fullBooking) });
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
    const updates = {};
    if (checkIn !== undefined) updates.checkIn = checkIn;
    if (checkOut !== undefined) updates.checkOut = checkOut;
    if (guests !== undefined) updates.guests = guests;
    if (specialRequests !== undefined) updates.specialRequests = specialRequests;
    if (status !== undefined) updates.status = status;
    if (paymentStatus !== undefined) updates.paymentStatus = paymentStatus;
    if (totalPrice !== undefined) updates.totalPrice = totalPrice;

    // Validate business logic for status changes to Completed
    if (status === 'Completed') {
      const now = new Date();
      if (now < new Date(booking.check_out)) {
        return res.status(400).json({ message: 'Cannot complete future booking. Checkout date must have passed.' });
      }
      if (booking.payment_status !== 'Paid') {
        return res.status(400).json({ message: 'Cannot complete unpaid booking. Payment must be marked as Paid first.' });
      }
    }

    const updatedBooking = await Booking.update(req.params.id, updates);
    const fullBooking = await Booking.findById(updatedBooking.id);
    res.json({ message: 'Booking updated successfully', booking: formatBooking(fullBooking) });
  } catch (error) {
    console.error('Booking update error for booking ID:', req.params.id, error);
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.deleteByIdAndUserId(req.params.id, req.user.id);
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
    const booking = await Booking.deleteById(req.params.id);
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

