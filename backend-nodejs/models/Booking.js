const { pool } = require('../config/db');

const Booking = {
async findAll() {
    const { rows } = await pool.query(`
      SELECT b.*, u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email,
             r.name AS room_name, r.type AS room_type, r.price AS room_price,
             ri.room_number AS room_number, ri.floor AS floor
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_instances ri ON b.room_instance_id = ri.id
      ORDER BY b.id ASC
    `);
    return rows;
  },

  async findByUserId(userId) {
    const { rows } = await pool.query(`
      SELECT b.*, r.name AS room_name, r.type AS room_type, r.price AS room_price,
             ri.room_number AS room_number, ri.floor AS floor
      FROM bookings b
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_instances ri ON b.room_instance_id = ri.id
      WHERE b.user_id = $1
      ORDER BY b.id ASC
    `, [userId]);
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(`
      SELECT b.*, r.name AS room_name, r.type AS room_type, r.price AS room_price,
             ri.room_number AS room_number, ri.floor AS floor
      FROM bookings b
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_instances ri ON b.room_instance_id = ri.id
      WHERE b.id = $1
    `, [id]);
    return rows[0] || null;
  },

  async findByIdAndUserId(id, userId) {
    const { rows } = await pool.query(`
      SELECT b.*, r.name AS room_name, r.type AS room_type, r.price AS room_price,
             ri.room_number AS room_number, ri.floor AS floor
      FROM bookings b
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_instances ri ON b.room_instance_id = ri.id
      WHERE b.id = $1 AND b.user_id = $2
    `, [id, userId]);
    return rows[0] || null;
  },

async findPaid() {
    const { rows } = await pool.query(`
      SELECT b.*, u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email,
             r.name AS room_name, ri.room_number AS room_number, ri.floor AS floor
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN room_instances ri ON b.room_instance_id = ri.id
      WHERE b.payment_status = 'Paid'
      ORDER BY b.id ASC
    `);
    return rows;
  },

  async countPendingPayments() {
    const { rows } = await pool.query(`SELECT COUNT(*) AS count FROM bookings WHERE payment_status = 'Pending'`);
    return parseInt(rows[0].count, 10);
  },

async create({ userId, roomId, roomInstanceId, roomName, roomNumber, floor, guestName, guestEmail, checkIn, checkOut, guests = 1, specialRequests = '', totalPrice = 0, status = 'Pending', paymentStatus = 'Pending', paymentMethod = null, paymentDate = null }) {
    const { rows } = await pool.query(
      `INSERT INTO bookings (user_id, room_id, room_instance_id, room_name, room_number, floor, guest_name, guest_email, check_in, check_out, guests, special_requests, total_price, status, payment_status, payment_method, payment_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
      [userId, roomId, roomInstanceId, roomName, roomNumber, floor, guestName, guestEmail, checkIn, checkOut, guests, specialRequests, totalPrice, status, paymentStatus, paymentMethod, paymentDate]
    );
    return rows[0];
  },

async update(id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (updates.roomId !== undefined) { fields.push(`room_id = $${idx++}`); values.push(updates.roomId); }
    if (updates.roomInstanceId !== undefined) { fields.push(`room_instance_id = $${idx++}`); values.push(updates.roomInstanceId); }
    if (updates.roomName !== undefined) { fields.push(`room_name = $${idx++}`); values.push(updates.roomName); }
    if (updates.roomNumber !== undefined) { fields.push(`room_number = $${idx++}`); values.push(updates.roomNumber); }
    if (updates.floor !== undefined) { fields.push(`floor = $${idx++}`); values.push(updates.floor); }
    if (updates.guestName !== undefined) { fields.push(`guest_name = $${idx++}`); values.push(updates.guestName); }
    if (updates.guestEmail !== undefined) { fields.push(`guest_email = $${idx++}`); values.push(updates.guestEmail); }
    if (updates.checkIn !== undefined) { fields.push(`check_in = $${idx++}`); values.push(updates.checkIn); }
    if (updates.checkOut !== undefined) { fields.push(`check_out = $${idx++}`); values.push(updates.checkOut); }
    if (updates.guests !== undefined) { fields.push(`guests = $${idx++}`); values.push(updates.guests); }
    if (updates.specialRequests !== undefined) { fields.push(`special_requests = $${idx++}`); values.push(updates.specialRequests); }
    if (updates.totalPrice !== undefined) { fields.push(`total_price = $${idx++}`); values.push(updates.totalPrice); }
    if (updates.status !== undefined) { fields.push(`status = $${idx++}`); values.push(updates.status); }
    if (updates.paymentStatus !== undefined) { fields.push(`payment_status = $${idx++}`); values.push(updates.paymentStatus); }
    if (updates.paymentMethod !== undefined) { fields.push(`payment_method = $${idx++}`); values.push(updates.paymentMethod); }
    if (updates.paymentDate !== undefined) { fields.push(`payment_date = $${idx++}`); values.push(updates.paymentDate); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE bookings SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async deleteById(id) {
    const { rows } = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
  },

  async deleteByIdAndUserId(id, userId) {
    const { rows } = await pool.query('DELETE FROM bookings WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
    return rows[0] || null;
  },

  async deleteAll() {
    await pool.query('DELETE FROM bookings');
  },

  async findOverlappingByRoomId(roomId, checkIn, checkOut) {
    const { rows } = await pool.query(`
      SELECT * FROM bookings 
      WHERE room_id = $1 
      AND check_in < $3 
      AND check_out > $2
    `, [roomId, checkIn, checkOut]);
    return rows;
  }
};

module.exports = Booking;

