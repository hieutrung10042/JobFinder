const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '10042005',
    database: 'job_finder_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Chuyển sang dùng Promise để code gọn hơn với async/await
const promisePool = pool.promise();

module.exports = promisePool;