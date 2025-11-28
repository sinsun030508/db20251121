// ✅ config/db.js (또는 너가 쓰는 db 파일)
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'db202245079', // 실제 DB 이름 맞게
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('Successfully connected to the database.');
    conn.release();
  } catch (err) {
    console.error('DB connection error:', err);
  }
}
testConnection();

module.exports = pool;
