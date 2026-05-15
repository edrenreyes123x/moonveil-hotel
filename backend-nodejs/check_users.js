const { pool, initDB } = require('./config/db');

async function check() {
  await initDB();
  const result = await pool.query('SELECT id, first_name, email, role FROM users ORDER BY id');
  console.log('Users in database:');
  console.log(result.rows);
  await pool.end();
}

check();
