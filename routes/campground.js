const express = require('express');
const router = express.Router();
const catchsyn = require('../utils/catchAsyn');
const Campground = require('../models/campground');
// const ExpressError = require('../utils/ExpressError');
// const { campgroundSchema, reviewSchema } = require('../utils/validateCampground');
const {isLoggedin,validateCampground,isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campground');
const session = require('express-session');
const multer = require('multer');

const {storage} =require('../cloudinary')
const upload = multer({storage});

router.route('/')
    .get(catchsyn(campgrounds.index))
    .post(isLoggedin, upload.array('image'), validateCampground ,catchsyn(campgrounds.createCamground));
// .post(upload.array('image'),(req,res)=>{
//     res.send(req.body);
//     console.log(req.files);
// })

router.get('/new', isLoggedin, campgrounds.newCampground);
//order matter!!!!!


router.route('/:id')
    .get(catchsyn(campgrounds.showCampground))
    .put(isLoggedin, isAuthor, upload.array('image'),validateCampground, catchsyn(campgrounds.updateCampground))
    .delete (isLoggedin, isAuthor, catchsyn(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedin,isAuthor,catchsyn(campgrounds.editCampground));


module.exports = router;