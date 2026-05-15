const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: 'postgresql://postgres:reyesedren123x11@localhost:5432/moonveil'
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        description TEXT NOT NULL,
        amenities TEXT[],
        image VARCHAR(500),
        rating NUMERIC(2,1) DEFAULT 0,
        available BOOLEAN DEFAULT true,
        bookings INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

await client.query(`
      CREATE TABLE IF NOT EXISTS room_instances (
        id SERIAL PRIMARY KEY,
        type_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
        room_number VARCHAR(100) UNIQUE NOT NULL,
        floor INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'Available',
        type_name VARCHAR(255),
        price NUMERIC(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
        room_instance_id INTEGER REFERENCES room_instances(id) ON DELETE SET NULL,
        room_name VARCHAR(255) NOT NULL,
        room_number VARCHAR(100),
        floor INTEGER,
        guest_name VARCHAR(255) NOT NULL,
        guest_email VARCHAR(255) NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        guests INTEGER DEFAULT 1,
        special_requests TEXT,
        total_price NUMERIC(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        payment_status VARCHAR(50) DEFAULT 'Pending',
        payment_method VARCHAR(50),
        payment_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ PostgreSQL tables initialized');
  } catch (err) {
    console.error('❌ Error initializing PostgreSQL tables:', err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { pool, initDB };
