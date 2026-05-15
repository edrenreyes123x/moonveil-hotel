const { pool } = require('../config/db');

const RoomInstance = {
  async findAll() {
    const { rows } = await pool.query(`
      SELECT ri.*, r.name AS room_name, r.type AS room_type, r.price AS room_price
      FROM room_instances ri
      LEFT JOIN rooms r ON ri.type_id = r.id
      ORDER BY ri.id ASC
    `);
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(`
      SELECT ri.*, r.name AS room_name, r.type AS room_type, r.price AS room_price
      FROM room_instances ri
      LEFT JOIN rooms r ON ri.type_id = r.id
      WHERE ri.id = $1
    `, [id]);
    return rows[0] || null;
  },

  async findByTypeId(typeId) {
    const { rows } = await pool.query(`
      SELECT ri.*, r.name AS room_name, r.type AS room_type, r.price AS room_price
      FROM room_instances ri
      LEFT JOIN rooms r ON ri.type_id = r.id
      WHERE ri.type_id = $1
    `, [typeId]);
    return rows;
  },

  async findAvailable() {
    const { rows } = await pool.query(`
      SELECT ri.*, r.name AS room_name, r.type AS room_type, r.price AS room_price
      FROM room_instances ri
      LEFT JOIN rooms r ON ri.type_id = r.id
      WHERE ri.status = 'Available'
    `);
    return rows;
  },

async create({ typeId, roomNumber, floor, typeName = '', price = 0, status = 'Available' }) {
    const { rows } = await pool.query(
      `INSERT INTO room_instances (type_id, room_number, floor, type_name, price, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [typeId, roomNumber, floor, typeName, price, status]
    );
    return rows[0];
  },

  async update(id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (updates.typeId !== undefined) { fields.push(`type_id = $${idx++}`); values.push(updates.typeId); }
    if (updates.roomNumber !== undefined) { fields.push(`room_number = $${idx++}`); values.push(updates.roomNumber); }
    if (updates.typeName !== undefined) { fields.push(`type_name = $${idx++}`); values.push(updates.typeName); }
    if (updates.price !== undefined) { fields.push(`price = $${idx++}`); values.push(updates.price); }
    if (updates.status !== undefined) { fields.push(`status = $${idx++}`); values.push(updates.status); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE room_instances SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async deleteById(id) {
    const { rows } = await pool.query('DELETE FROM room_instances WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
  },

  async deleteAll() {
    await pool.query('DELETE FROM room_instances');
  }
};

module.exports = RoomInstance;

