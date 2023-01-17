const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const auth = require('../middleware/auth');

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
    body('storyPhotos', 'Please include a valid story photos').isArray()
], async (req,res) => {
    const requestErrors = validationResult(req);
    if(!requestErrors.isEmpty()){
        return res.status(400).json({msg: 'Bad input'});
    }

    res.status(200).send("Create a story");
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
    body('keyLearningOutcomes', 'Please provide valid search conditions').not().isEmpty()
], async (req,res) => {
    res.status(200).send("Returns stories with corresponding key words");
});

// @route POST /stories/visable
// @description Make story visable
// @access Public
router.post('/visable', [
    body('storyId', 'Please provide a valid storyId').not().isEmpty()
], async (req,res) => {
    res.status(200).send("Unavourited a story");
});

// @route POST /stories/invisible
// @description Make story invisisble
// @access Public
router.post('/invisable', [
    body('storyId', 'Please provide a valid storyId').not().isEmpty()
], async (req,res) => {
    res.status(200).send(`${req.body.storyId} made invisible`);
});

module.exports = router;