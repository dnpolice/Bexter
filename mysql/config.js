const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysqlpass',
  database: 'bexter',
});

db.connect((err) => {
 if (err) throw err;
 console.log('Connected to MySQL...');
});

module.exports = db;
