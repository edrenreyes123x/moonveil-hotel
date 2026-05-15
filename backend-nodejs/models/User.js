const { pool } = require('../config/db');

const User = {
  async findAll() {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY id ASC');
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  },

  async create({ firstName, lastName, email, password, role = 'user' }) {
    const { rows } = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [firstName, lastName, email, password, role]
    );
    return rows[0];
  },

  async update(id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (updates.firstName !== undefined) { fields.push(`first_name = $${idx++}`); values.push(updates.firstName); }
    if (updates.lastName !== undefined) { fields.push(`last_name = $${idx++}`); values.push(updates.lastName); }
    if (updates.email !== undefined) { fields.push(`email = $${idx++}`); values.push(updates.email); }
    if (updates.password !== undefined) { fields.push(`password = $${idx++}`); values.push(updates.password); }
    if (updates.role !== undefined) { fields.push(`role = $${idx++}`); values.push(updates.role); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async deleteById(id) {
    const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
  },

  async deleteAll() {
    await pool.query('DELETE FROM users');
  }
};

module.exports = User;

