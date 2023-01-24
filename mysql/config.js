const mysql = require('mysql2');
require('dotenv').config()

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

db.connect((err) => {
 if (err) throw err;
 console.log('Connected to MySQL...');
});

module.exports = db;
