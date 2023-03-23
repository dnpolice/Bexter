const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const userQuery = require('./users.js');

require('dotenv').config();

/*
    @route GET /auth
    @description Authenticate users through a token 
    @access Private
*/
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
        return res.status(400).json({ errors: requestErrors.array() });
    }
    
    const { email, password } = req.body;

    const getUser = () => { return new Promise(resolve =>
        userQuery.getUserWithEmail(email, (err, results) => {
            if (err) console.log(err)
            else resolve(results)
        }
    ))}
    const theUser = await getUser();
    if (theUser.length > 0){
        if (password !== theUser[0].password) {
            return res.status(403).json({msg: 'Incorrect email/password'});
        } 
    }
    else{
        return res.status(403).json({msg: 'Incorrect email/password (user email not found)'});
    }
    const userName = theUser[0].name;

    // now create token:
    const user = { email: email, password: password};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    
    // Save that token in cookie (or other storage..)
    // secure false for now
    const cookieOptions = {httpOnly: true, secure: false};
    res.cookie('saveUser', accessToken, cookieOptions);

    res.status(200).json({accessToken: accessToken, name: userName});
})

/*
    @route GET /auth/logout
    @description Logout the user
    @access Public
*/
router.get('/logout', (req, res) => {
    const cookieOptions = {httpOnly: true, secure: false};
    res.cookie('saveUser', 'loggedout', cookieOptions);
    res.status(200).send(`User signed out`)
});

module.exports = router;
