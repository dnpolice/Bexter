const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const auth = require('../middleware/auth');
const db = require("../mysql/config");


// @route POST /stories/create
// @description Create a story
// @access Public
router.post('/create', [
    body('title', 'Please incude a valid title').not().isEmpty(),
    body('author', 'Please incude a valid author').not().isEmpty(),
    body('description', 'Please incude a valid description').not().isEmpty(),
    body('keyLearningOutcomes', 'Please incude valid key learning outcomes').isArray(),
    body('coverPhoto', 'Please incude a valid name').not().isEmpty(),
    body('voiceRecording', 'Please include a valid voice recording').not().isEmpty(),
    body('storyPhotos', 'Please include a valid story photos').isArray(),
    body('transcriptOfKeywords', 'Please include a valid transcript of keywords').isArray(),
    body('isVisible', 'Please include a valid is visable field').not().isEmpty(),
], async (req,res) => {
    const requestErrors = validationResult(req);
    if(!requestErrors.isEmpty()){
        return res.status(400).json({msg: requestErrors.array()});
    }

    let photo = res.body.coverPhoto;
    const cover_photo_path = `photos/${photo.name}`;
    try {
        await photo.mv(photo_path);
    } catch (err) {
        return res.status(500).json({ msg: err });
    }

    let story = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        key_learning_outcomes: JSON.stringify(req.body.keyLearningOutcomes),
        cover_photo_path: req.body.coverPhoto,
        voice_recording_path: req.body.voiceRecording,
        story_photos: JSON.stringify(req.body.storyPhotos),
        transcript_of_keywords: JSON.stringify(req.body.transcriptOfKeywords),
        is_visible:  req.body.isVisible,
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
        
        

    r
});

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
    res.status(200).send(`The storyId is ${req.params.storyId}`);
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