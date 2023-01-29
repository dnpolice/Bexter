const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const {upload} = require("../mysql/s3");
const multer = require('multer');
const uploadMulter = multer({dest: 'storage/'});
const { body } = require('express-validator');

exports.storeFilesInS3 = async (coverPhoto, voiceRecording, storyPhotos) => {
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

exports.createStoryObj = (body, coverPhotoKey, voiceRecordingKey, storyPhotoKeys) => {
    return {
        title: body.title,
        author: body.author,
        description: body.description,
        key_learning_outcomes: JSON.stringify(body.keyLearningOutcomes),
        cover_photo_path: coverPhotoKey,
        voice_recording_path: voiceRecordingKey,
        story_photo_paths: JSON.stringify(storyPhotoKeys),
        story_photo_times: JSON.stringify(body.storyPhotoTimes),
        transcript_of_keywords: JSON.stringify(body.transcriptOfKeywords),
        transcript_of_keyword_times: JSON.stringify(body.transcriptOfKeywordTimes),
        is_visible: body.isVisible == true || body.isVisible == "true",
        date_created: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
}

exports.extractStoryFiles = uploadMulter.fields([
    {
        name: 'coverPhoto', maxCount: 1
    }, {
        name: 'storyPhotos', maxCount: 100
    }, {
        name: 'voiceRecording', maxCount: 1
    }
]);

exports.verifyStoryInput = [
    body('title', 'Please incude a valid title').not().isEmpty(),
    body('author', 'Please incude a valid author').not().isEmpty(),
    body('description', 'Please incude a valid description').not().isEmpty(),
    body('keyLearningOutcomes', 'Please incude valid key learning outcomes').isArray(),
    body('storyPhotoTimes', 'Please include a valid story photos').isArray(),
    body('transcriptOfKeywords', 'Please include a valid transcript of keywords').not().isEmpty(),
    body('transcriptOfKeywordTimes', 'Please include valid transcript of keyword times').not().isEmpty(),
    body('isVisible', 'Please include a valid is visable field').not().isEmpty(),
]