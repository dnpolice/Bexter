const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const db = require('../mysql/config')

async function getUserWithEmail (email, callback) {
    db.query(`SELECT * from users WHERE email = ?`,  [email], async (err, results) => {
        if (err) callback(err, null);
        else callback(null, results);
    });
}

// @route POST users
// @description Signup a user
// @access Public
router.post('/', [
    body('name', 'Please incude a valid name').not().isEmpty(),
    body('email', 'Please incude a valid email').isEmail(),
    body('robotSerialNumber', 'Please incude a valid serial number').not().isEmpty(),
    body('password', 'Please incude a valid password').not().isEmpty(),
], async (req,res) => {
    // Check if input is valid
    const requestErrors = validationResult(req);
    if(!requestErrors.isEmpty()){
        return res.status(400).json({msg: 'Bad input'});
    }
    const { name, email, password, robotSerialNumber } = req.body;

    // Check if email exists in db
    const checkUserExists = () => { return new Promise(resolve =>
        getUserWithEmail(email, (err, results) => {
            if (err) console.log(err)
            else resolve(Boolean(results.length >0))
        }
    ))}
    const userExists = await checkUserExists();
    if (userExists== true){
        return res.status(409).json({msg: 'Email already exists, user not created'});
    }

    // TODO: Hash password (or not?)

    // Insert the user into db 
    const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query(`INSERT INTO users SET?`, 
        {
            name: name, 
            email: email, 
            password: password, 
            robotSerialNumber: robotSerialNumber,
            dateCreated: dateCreated
        }, (err) => {
            if(err) throw err;
    });
    //then login ? do i need to set req.user? 
    res.status(200).send("Created a user")
});

module.exports = router;
module.exports.getUserWithEmail = getUserWithEmail;
