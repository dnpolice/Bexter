const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const auth = require('../middleware/auth');
const db = require("../mysql/config");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const {upload, getS3Object, getS3Objects} = require("../mysql/s3");

//Setup file middleware
const multer = require('multer');
const uploadMulter = multer({dest: 'storage/'});
const extractFiles = uploadMulter.fields([
    {
        name: 'coverPhoto', maxCount: 1
    }, {
        name: 'storyPhotos', maxCount: 100
    }, {
        name: 'voiceRecording', maxCount: 1
    }
]);


// @route POST /stories/create
// @description Create a story
// @access Public
router.post('/create', extractFiles, [
    body('title', 'Please incude a valid title').not().isEmpty(),
    body('author', 'Please incude a valid author').not().isEmpty(),
    body('description', 'Please incude a valid description').not().isEmpty(),
    body('keyLearningOutcomes', 'Please incude valid key learning outcomes').isArray(),
    body('storyPhotoTimes', 'Please include a valid story photos').isArray(),
    body('transcriptOfKeywords', 'Please include a valid transcript of keywords').not().isEmpty(),
    body('transcriptOfKeywordTimes', 'Please include valid transcript of keyword times').not().isEmpty(),
    body('isVisible', 'Please include a valid is visable field').not().isEmpty(),
], async (req,res) => {
    //Checks errors in body data
    const requestErrors = validationResult(req);
    if(!requestErrors.isEmpty()){
        return res.status(400).json({msg: requestErrors.array()});
    }

    const {
        coverPhotoKey,
        voiceRecordingKey,
        storyPhotoKeys
    } = await storeFilesInS3(
            req.files.coverPhoto[0],
            req.files.voiceRecording[0],
            req.files.storyPhotos
    );

    let story = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        key_learning_outcomes: JSON.stringify(req.body.keyLearningOutcomes),
        cover_photo_path: coverPhotoKey,
        voice_recording_path: voiceRecordingKey,
        story_photo_paths: JSON.stringify(storyPhotoKeys),
        story_photo_times: JSON.stringify(req.body.storyPhotoTimes),
        transcript_of_keywords: JSON.stringify(req.body.transcriptOfKeywords),
        transcript_of_keyword_times: JSON.stringify(req.body.transcriptOfKeywordTimes),
        is_visible: req.body.isVisible == true || req.body.isVisible == "true",
        date_created: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    let sql = 'INSERT INTO stories SET ?';
    query = db.query(sql, story, (err, result) => {
        if (err) {
            res.status(500).json({msg: err.sqlMessage});
            console.log(err);
            throw err;
        } else {
            console.log(result.insertId);
            res.status(200).send({uuid: result.insertId});
        }
    });
});


const storeFilesInS3 = async (coverPhoto, voiceRecording, storyPhotos) => {
    const promises = [];

    // Execute Amazon S3 requests
    promises.push(upload(coverPhoto))
    promises.push(upload(voiceRecording))
    promises.push(Promise.all(storyPhotos.map(storyPhoto =>
        upload(storyPhoto)
    )))

    const result = await Promise.all(promises);
    
    // Get keys and unlink files
    const coverPhotoKey = result[0].key;
    const voiceRecordingKey = result[1].key;
    const storyPhotoKeys = result[2].map(storyPhotoRes => storyPhotoRes.key)
        
    for (storyPhoto of storyPhotos) unlinkFile(storyPhoto.path).catch(err => {console.log(err)});
    unlinkFile(coverPhoto.path).catch(err => {console.log(err)});
    unlinkFile(voiceRecording.path).catch(err => {console.log(err)});

    return {
        coverPhotoKey,
        voiceRecordingKey,
        storyPhotoKeys
    }
}


// @route POST /stories/delete
// @description Delete a story
// @access Public
router.post('/delete', [
    body('storyId', 'Please incude a valid storyId').not().isEmpty(),
], async (req,res) => {
    const requestErrors = validationResult(req);
    if(!requestErrors.isEmpty()){
        return res.status(400).json({msg: 'Bad input'});
    }

    res.status(200).send("Delete a story");
});


// @route GET /stories/robot/:storyId
// @description Return the story for the robot
// @access Public
router.get('/robot/:storyId', async (req,res) => {
    let sql = `SELECT * FROM stories where id = ${req.params.storyId}`;
    db.query(sql, async (err, result) => {
        if (err) throw err;
        const story = result[0];
        const cover_photo_key = story.cover_photo_path;
        const voice_recording_key = story.voice_recording_path;
        const story_photo_keys = JSON.parse(story.story_photo_paths);

        const promises = []
        promises.push(getS3Object(cover_photo_key));
        promises.push(getS3Object(voice_recording_key));
        promises.push(getS3Objects(story_photo_keys));
        const promiseResult = await Promise.all(promises);

        const coverPhoto = promiseResult[0]
        const voiceRecording = promiseResult[1]
        const storyPhotos = promiseResult[2]

        const robotStory = {
            coverPhoto,
            voiceRecording,
            storyPhotos,
            storyPhotoTimes: JSON.parse(story.story_photo_times),
	        transcriptOfKeywords: JSON.parse(story.transcript_of_keywords),
            transcriptOfKeywordTimes: JSON.parse(story.transcript_of_keyword_times)
        }
        
        res.status(200).json(robotStory);
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


// @route GET /stories/mobile/:storyId
// @description Return the story for mobile
// @access Public
router.get('/mobile/:storyId', async (req,res) => {
    res.status(200).send(`The storyId is ${req.params.storyId}`);
});


// @route GET /stories/favourites
// @description Returns favourited stories
// @access Private
router.get('/favourites', auth, async (req,res) => {
    console.log(req.userId);
    res.status(200).send("Returns stories favourited by the user");
});


// @route POST /stories/favourite
// @description Favourite a story
// @access Private
router.post('/favourite', [
    body('storyId', 'Please provide a valid storyId').not().isEmpty()
], async (req,res) => {
    res.status(200).send("Favourited a story");
});


// @route POST /stories/unfavourite
// @description Unfavourite a story
// @access Private
router.post('/unfavourite', [
    body('storyId', 'Please provide a valid storyId').not().isEmpty()
], async (req,res) => {
    res.status(200).send("Unfavourited a story");
});


// @route POST /stories/search
// @description Returns stories with matching key learning outcomes
// @access Public
router.post('/search', [
    body('keyLearningOutcomes', 'Please provide valid search conditions').isArray()
], async (req,res) => {
    res.status(200).send(`Returns stories with corresponding key words ${req.body.keyLearningOutcomes}`) ;
});


// @route POST /stories/visable
// @description Make story visable
// @access Public
router.post('/visable', [
    body('storyId', 'Please provide a valid storyId').not().isEmpty()
], async (req,res) => {
    res.status(200).send(`Made story ${req.body.storyId} visable`);
});


// @route POST /stories/invisible
// @description Make story invisisble
// @access Public
router.post('/invisable', [
    body('storyId', 'Please provide a valid storyId').not().isEmpty()
], async (req,res) => {
    res.status(200).send(`Made story ${req.body.storyId} invisable`);
});

module.exports = router;