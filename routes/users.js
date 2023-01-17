const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');

// @route POST api/users
// @description Signup a user
// @access Public
router.post('/', [
    body('name', 'Please incude a valid name').not().isEmpty(),
    body('email', 'Please incude a valid email').isEmail(),
    body('serialNumber', 'Please incude a valid serial number').isEmpty(),
    body('password', 'Please incude a valid name').not().isEmpty(),
], async (req,res) => {
    const requestErrors = validationResult(req);
    if(!requestErrors.isEmpty()){
        return res.status(400).json({msg: 'Bad input'});
    }

    res.status(200).send("Create a user")
});

module.exports = router;