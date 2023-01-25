const express = require('express');
const router = express.Router();
const db = require('../mysql/config');
const multer = require('multer');
const uploadMulter = multer({dest: 'storage/'});
const storyPhotos = uploadMulter.array("storyPhotos", 5); 
const coverPhoto = uploadMulter.single("coverPhoto");
const fileFields = uploadMulter.fields([
    {
        name: 'coverPhoto', maxCount: 1
    }, {
        name: 'storyPhotos', maxCount: 100
    }, {
        name: 'voiceRecording', maxCount: 1
    }
]);
const path = require('path');
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const {upload, getFileStream} = require("../mysql/s3");

router.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE if not exists bexter';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).send('DB created');
    })
});

router.post("/images", coverPhoto, async (req, res) => {
    const file = req.file;
    console.log(file);
    const result = await upload(file);
    await unlinkFile(file.path);
    console.log(result);

    res.status(200).json({msg: `The storage key is ${result.key}`});
});

// router.get("/imagesMulti", coverPhoto, async (req, res) => {
//     const key = req.params.key;
//     const readStream = getFileStream(key);

//     readStream.pipe(res);
// });

router.post("/imagesMulti", fileFields, async (req, res) => {
    const coverPhoto = req.files.coverPhoto[0];
    const storyPhotos = req.files.storyPhotos;
    const voiceRecording = req.files.voiceRecording[0];

    const coverPhotoKey = (await upload(coverPhoto)).key;
    const voiceRecordingKey = (await upload(voiceRecording)).key;
    await unlinkFile(coverPhoto.path);
    await unlinkFile(voiceRecording.path);

    const storyPhotosKey = [];
    for (storyPhoto of storyPhotos) {
        storyPhotosKey.push((await upload(storyPhoto)).key);
        await unlinkFile(storyPhoto.path);
    }
    

    res.status(200).json({
        coverPhotoKey,
        storyPhotosKey,
        voiceRecordingKey
    });
});

router.get("/imagesS3/:key", (req, res) => {
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
})

router.get("/images", (req, res) => {
    let files = [];
    let filepath = path.resolve(__dirname, "../storage/");

    fs.readdir(filepath, function(err, items) {
        if (err) throw err;
        for (fileName of items) {
            let fileUrl = filepath + "/" + fileName
            res.download(fileUrl);
        }
    });
})

router.get("/image", (req, res) => {
    let files = [];
    let filepath = path.resolve(__dirname, "../storage/");

    fs.readdir(filepath, function(err, items) {
        if (err) throw err;
        for (fileName of items) {
            let fileUrl = filepath + "/" + fileName
            res.download(fileUrl);
        }
    });
})

router.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE if not exists bexter';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).send('DB created');
    })
});

router.get('/multer', (req, res) => {
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