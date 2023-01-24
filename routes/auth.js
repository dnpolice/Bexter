const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
require('dotenv').config()

/*
    @route GET /auth
    @description Authenticate users through a token 
    @access Private
*/
//what is this one for..? Moving the check-if-logged-in to middleware
router.get('/', auth, (req, res) => {
    res.status(200).send(`The users email is ${req.user.email}`)
});

/*
    @route POST /auth/login
    @description Login a user
    @access Public
*/
router.post('/login', [
    body('email', 'Please incude a valid email').isEmail(),
    body('password', 'Please incude a valid password').not().isEmpty(),
], async (req, res) => {
    const requestErrors = validationResult(req);
    if(!requestErrors.isEmpty()){
        console.log(":((")
        return res.status(400).json({ errors: requestErrors.array() });
    }
    
    const { email, password } = req.body;

    // TODO: query db to see if email and password matches
    
    //now create token:
    const user = { email: email, password: password} ;
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    
    // TODO: Save that token in cookie (or other storage..)

    res.status(200).json({accessToken: accessToken}).send("Logged in the user");
})


module.exports = router;