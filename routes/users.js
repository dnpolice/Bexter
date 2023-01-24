const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');

// @route POST users
// @description Signup a user
// @access Public
router.post('/', [
    body('name', 'Please incude a valid name').not().isEmpty(),
    body('email', 'Please incude a valid email').isEmail(),
    body('serialNumber', 'Please incude a valid serial number').not().isEmpty(),
    body('password', 'Please incude a valid password').not().isEmpty(),
], async (req,res) => {
    // Check if input is valid
    const requestErrors = validationResult(req);
    if(!requestErrors.isEmpty()){
        return res.status(400).json({msg: 'Bad input'});
    }

    // TODO: Check if email exists in db

    // TODO: Hash password (or not?)
    // TODO: Insert into db the user

    //then login ? do i need to redirect?
    res.status(200).send("Create a user")
});

module.exports = router;