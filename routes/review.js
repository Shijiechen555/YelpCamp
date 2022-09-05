const express = require('express');
const router = express.Router({mergeParams:true});
//default of req.para will seperate the router and would not be able to access
//the param from app.js
const catchsyn = require('../utils/catchAsyn');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('../utils/validateCampground');
const Campground = require('../models/campground');
const {validateReview,isLoggedin} = require('../middleware');
const reviews = require('../controllers/review');


router.post('/', isLoggedin,validateReview, catchsyn(reviews.postReview));

router.delete('/:reid', catchsyn(reviews.deleteReview));

module.exports = router;