const db = require('./config')

// let createUsersTableQuery = 
//   `CREATE TABLE if not exists users(
//   userID            int           NOT NULL AUTO_INCREMENT,
//   email             VARCHAR(50)   NOT NULL,
//   password          VARCHAR (20)  NOT NULL,
//   robotSerialNumber INT           NOT NULL,
//   dateCreated       datetime      NOT NULL,
//   PRIMARY KEY (userID));`;
// con.query(createUsersTableQuery, (err) => {
//   if(err) throw err;
// });
// ok we might not need this file but im just leaving them so
// i can go back to it
let insertUserQuery = 
    `INSERT INTO users(email,password, robotSerialNumber, dateCreated)
    VALUES('someemail', 'somepassword', 1, NOW())`;
db.query(insertUserQuery, (err) => {
  if(err) throw err;
});

db.query('SELECT * FROM users', (err,rows) => {
  if(err) throw err;
  console.log('Data received from Db:');
  console.log(rows);
});

db.end();