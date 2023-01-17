const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');

/*
    @route GET /auth
    @description Authenticate users through a token
    @access Private
*/
router.get('/', (req, res) => {
    res.status(200).send("Check token of the user")
});

/*
    @route POST /auth
    @description Login a user
    @access Public
*/
router.post('/', [
    body('email', 'Please incude a valid email').isEmail(),
    body('password', 'Please incude a valid name').not().isEmpty(),
], async (req, res) => {
    const requestErrors = validationResult(req);
    if(!requestErrors.isEmpty()){
        return res.status(400).json({msg: 'Bad credentials'});
    }

    res.status(200).send("Login the user")
});




module.exports = router;