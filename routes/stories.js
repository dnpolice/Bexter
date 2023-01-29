const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const db = require("../mysql/config");
const { storeFilesInS3, createStoryObj, extractStoryFiles, verifyStoryInput } = require("../helpers/stories");
const { getS3Object, getS3Objects, getS3Url } = require("../mysql/s3");


// @route POST /stories/create
// @description Create a story
// @access Public
router.post('/create', extractStoryFiles, verifyStoryInput, async (req,res) => {
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

    let story = createStoryObj(req.body, coverPhotoKey, voiceRecordingKey, storyPhotoKeys)

    let sql = 'INSERT INTO stories SET ?';
    query = db.query(sql, story, (err, result) => {
        if (err) {
            res.status(500).json({msg: err.sqlMessage});
            console.log(err);
        } else {
            let keyword_sql = 'INSERT INTO keyword_to_story SET ?';
            for (keyword of req.body.keyLearningOutcomes) {
                let keyword_to_story = {
                    story_id: result.insertId,
                    keyword
                }
                db.query(keyword_sql, keyword_to_story, (err, result) => {
                    if (err) console.log(err);
                });
            }
            res.status(200).send({uuid: result.insertId});
        }
    });
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
    let sql = `SELECT * FROM stories where id = ${req.params.storyId}`;
    db.query(sql, async (err, result) => {
        if (err) res.status(500).json({msg: err.sqlMessage});
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


// @route GET /stories/mobile/:storyId
// @description Return the story for mobile
// @access Public
router.get('/mobile/:storyId', async (req,res) => {
    let sql = `SELECT * FROM stories where id = ${req.params.storyId}`;
    db.query(sql, async (err, result) => {
        if (err) res.status(500).json({msg: err.sqlMessage});
        const story = result[0];
        const cover_photo_key = story.cover_photo_path;

        const url = await getS3Url(cover_photo_key);

        const mobileStory = {
            title: story.title,
            author: story.author,
            description: story.description,
            keyLearningOutcomes: JSON.parse(story.key_learning_outcomes),
            coverPhoto: url
        }
        
        res.status(200).json(mobileStory);
    });
});


// @route GET /stories/favourites
// @description Returns favourited stories
// @access Private
router.get('/favourites', auth, async (req,res) => {
    let sql = `select * from user_to_story_favourite INNER JOIN stories on user_to_story_favourite.story_id = stories.id where user_id = ${req.user}`;
    db.query(sql, async (err, result) => {
        if (err) res.status(500).json({msg: err.sqlMessage});
        const coverPhotos = await Promise.all(result.map(story => {
            return getS3Url(story.cover_photo_path)
        }));

        
        favouriteStories = []
        for (let i = 0; i < coverPhotos.length; i++) {
            const favouriteStory = {
                title: result[i].title,
                author: result[i].author,
                description: result[i].description,
                keyLearningOutcomes: JSON.parse(result[i].key_learning_outcomes),
                coverPhoto: coverPhotos[i],
            }
            favouriteStories.push(favouriteStory);

        }
        
        res.status(200).json(favouriteStories);
    });
});


// @route POST /stories/favourite
// @description Favourite a story
// @access Private
router.post('/favourite', auth, [
    body('storyId', 'Please provide a valid storyId').not().isEmpty()
], async (req,res) => {
        const requestErrors = validationResult(req);
        if(!requestErrors.isEmpty()) {
            return res.status(400).json({msg: requestErrors.array()});
        }
        let sql = `INSERT INTO user_to_story_favourite SET ?`;
        let user_to_story_favourite = {
            user_id: req.user,
            story_id: req.body.storyId
        }

        db.query(sql, user_to_story_favourite, (err, result) => {
            if (err) {
                res.status(500).json({msg: err.sqlMessage});
                console.log(err);
            } else {
                res.status(200).send({msg: `Favourited story ${req.body.storyId}`});
            }
        });
    }
);


// @route POST /stories/unfavourite
// @description Unfavourite a story
// @access Private
router.post('/unfavourite', auth, [
    body('storyId', 'Please provide a valid storyId').not().isEmpty()
], async (req,res) => {
    const requestErrors = validationResult(req);
    if(!requestErrors.isEmpty()){
        return res.status(400).json({msg: requestErrors.array()});
    }
    let sql = `DELETE FROM user_to_story_favourite where user_id = ${req.user} and story_id = ${req.body.storyId}`;

    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({msg: err.sqlMessage});
            console.log(err);
        } else {
            res.status(200).send({msg: `Unfavourited story ${req.body.storyId}`});
        }
    })
});


// @route POST /stories/search
// @description Returns stories with matching key learning outcomes
// @access Public
router.post('/search', [
    body('keyLearningOutcomes', 'Please provide valid search conditions').isArray()
], async (req,res) => {
    const requestErrors = validationResult(req);
    if(!requestErrors.isEmpty()){
        return res.status(400).json({msg: requestErrors.array()});
    }
    const keywords = req.body.keyLearningOutcomes;
    let sql = `select * from keyword_to_story INNER JOIN stories on keyword_to_story.story_id = stories.id where keyword in (${keywords.map(keyword => `'${keyword}'`)})`;
    db.query(sql, async (err, result) => {
        if (err) res.status(500).json({msg: err.sqlMessage});
        const coverPhotos = await Promise.all(result.map(story => {
            return getS3Url(story.cover_photo_path)
        }));

        searchStories = []
        const v = {};
        for (let i = 0; i < coverPhotos.length; i++) {
            const id = result[i].id
            if (id in v) continue;
            v[id] = true;

            const story = {
                title: result[i].title,
                author: result[i].author,
                description: result[i].description,
                keyLearningOutcomes: JSON.parse(result[i].key_learning_outcomes),
                coverPhoto: coverPhotos[i],
            }
            searchStories.push(story);
        }
        res.status(200).json(searchStories);
    });
});

// @route POST /stories/search
// @description Returns stories with matching key learning outcomes
// @access Public
router.get('/all', async (req,res) => {
    let sql = `select * from stories`;
    db.query(sql, async (err, result) => {
        if (err) res.status(500).json({msg: err.sqlMessage});
        const coverPhotos = await Promise.all(result.map(story => {
            return getS3Url(story.cover_photo_path)
        }));

        stories = []
        const v = {};
        for (let i = 0; i < coverPhotos.length; i++) {
            const id = result[i].id
            if (id in v) continue;
            v[id] = true;

            const story = {
                title: result[i].title,
                author: result[i].author,
                description: result[i].description,
                keyLearningOutcomes: JSON.parse(result[i].key_learning_outcomes),
                coverPhoto: coverPhotos[i],
            }
            stories.push(story);
        }
        res.status(200).json(stories);
    });
});


// @route POST /stories/visible
// @description Make story visible
// @access Public
router.post('/visible', [
    body('storyId', 'Please provide a valid storyId').not().isEmpty()
], async (req,res) => {
    let sql = `UPDATE stories SET is_visible = true where id = ${req.body.storyId}`;
    
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({msg: err.sqlMessage});
            console.log(err);
        } else {
            res.status(200).send({msg: `Made story ${req.body.storyId} visable`});
        }
    }) 
});


// @route POST /stories/invisible
// @description Make story invisible
// @access Public
router.post('/invisible', [
    body('storyId', 'Please provide a valid storyId').not().isEmpty()
], async (req,res) => {
    let sql = `UPDATE stories SET is_visible = false where id = ${req.body.storyId}`;
    
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({msg: err.sqlMessage});
            console.log(err);
        } else {
            res.status(200).send({msg: `Made story ${req.body.storyId} invisible`});
        }
    }) 
});

module.exports = router;