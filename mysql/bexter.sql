CREATE DATABASE if not exists bexter;
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mysqlpass';
-- flush privileges;
USE bexter;
CREATE TABLE if not exists users(
	userID int NOT NULL AUTO_INCREMENT,
   name    VARCHAR(50)   NOT NULL,
   email   VARCHAR(50)   NOT NULL,
   password VARCHAR (20)     NOT NULL,
   robotSerialNumber  INT        NOT NULL,
   dateCreated  datetime  NOT NULL ,
   PRIMARY KEY (userID)
);
-- DROP TABLE users;
SELECT * FROM users;
