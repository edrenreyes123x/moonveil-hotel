const { pool } = require('../config/db');

const Room = {
  async findAll() {
    const { rows } = await pool.query('SELECT * FROM rooms ORDER BY id ASC');
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async create({ name, type, price, description, amenities = [], image = '', rating = 0, available = true, bookings = 0 }) {
    const { rows } = await pool.query(
      `INSERT INTO rooms (name, type, price, description, amenities, image, rating, available, bookings)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, type, price, description, amenities, image, rating, available, bookings]
    );
    return rows[0];
  },

  async update(id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (updates.name !== undefined) { fields.push(`name = $${idx++}`); values.push(updates.name); }
    if (updates.type !== undefined) { fields.push(`type = $${idx++}`); values.push(updates.type); }
    if (updates.price !== undefined) { fields.push(`price = $${idx++}`); values.push(updates.price); }
    if (updates.description !== undefined) { fields.push(`description = $${idx++}`); values.push(updates.description); }
    if (updates.amenities !== undefined) { fields.push(`amenities = $${idx++}`); values.push(updates.amenities); }
    if (updates.image !== undefined) { fields.push(`image = $${idx++}`); values.push(updates.image); }
    if (updates.rating !== undefined) { fields.push(`rating = $${idx++}`); values.push(updates.rating); }
    if (updates.available !== undefined) { fields.push(`available = $${idx++}`); values.push(updates.available); }
    if (updates.bookings !== undefined) { fields.push(`bookings = $${idx++}`); values.push(updates.bookings); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE rooms SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async deleteById(id) {
    const { rows } = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
  },

  async deleteAll() {
    await pool.query('DELETE FROM rooms');
  },

  async findByName(name) {
    const { rows } = await pool.query('SELECT * FROM rooms WHERE name ILIKE $1', [name]);
    return rows[0] || null;
  }
};

module.exports = Room;

