const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchsyn = require('../utils/catchAsyn');
const passport = require('passport');
const users = require('../controllers/user');


router.route('/register')
    .get(users.registerForm)
    .post(catchsyn(users.registerUser))

router.route('/login')
    .get(users.loginForm)
    .post( passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), users.loginUser)

// must use passpprt 5.0 versin instead of passport 6.0 version

router.get('/logout', users.logoutUser)


module.exports = router;