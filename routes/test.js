const express = require('express');
const router = express.Router();
const db = require('../mysql/config');

router.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE if not exists bexter';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).send('DB created');
    })
});

router.get('/createpoststable', (req, res) => {
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Posts table created')
    })
});

router.get('/addpost1', (req, res) => {
    let post = {title: 'Post One', body:'This is post number one'};
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Insert post 1 into table')
    });
});

router.get('/addpost2', (req, res) => {
    let post = {title: 'Post Two', body:'This is post number two'};
    let sql = 'INSERT INTO posts SET ?';
    db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Insert post 2 into table')
    });
});

router.get('/getposts', (req, res) => {
    let sql = `SELECT * FROM posts`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json({response: result});
    });
});

router.get('/getpost/:id', (req, res) => {
    let sql = `SELECT * FROM posts where id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json({response: result});
    });
});

router.get('/updatePostTitle/:id', (req, res) => {
    let newTitle = 'New Title 1';
    let sql = `UPDATE posts SET title = '${newTitle}' where id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(`Updated title on post with id ${req.params.id}`)
    });
});

module.exports = router;