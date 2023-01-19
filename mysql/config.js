const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysqlpass',
  database: 'bexter',
});

module.exports = con;
