// db.js
const { Pool } = require('pg');

// ตั้งค่าการเชื่อมต่อกับฐานข้อมูล PostgreSQL
const pool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'db',
password: 'rootroot',
port: 5432,
});

module.exports = pool;