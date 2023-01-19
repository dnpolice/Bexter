const con = require('./config')

con.connect((err) => {
  if(err){
    console.log('Error connecting to Db');
    console.log(err.message);
    return;
  }
  console.log('Connection established');
});

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

let insertUserQuery = 
    `INSERT INTO users(email,password, robotSerialNumber, dateCreated)
    VALUES('someemail', 'somepassword', 1, NOW())`;
con.query(insertUserQuery, (err) => {
  if(err) throw err;
});

con.query('SELECT * FROM users', (err,rows) => {
  if(err) throw err;
  console.log('Data received from Db:');
  console.log(rows);
});

con.end();