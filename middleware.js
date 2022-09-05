const { campgroundSchema, reviewSchema } = require('./utils/validateCampground');
const ExpressError = require('./utils/ExpressError');
const catchsyn = require('./utils/catchAsyn');
const Campground = require('./models/campground');


module.exports.isLoggedin = (req, res, next) => {
    // console.log(req.user);
    //also from passport
    if (!req.isAuthenticated()) {
        req.session.returnto = req.originalUrl;
        //from express npm, we often want the originalUrl to find the place 
        //users were at and store it in a veriable

        //stroe the url that are requesting
        //this mehod is form passport checking if you signed in or not
        req.flash('error', 'you must be signed in')
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        console.log(error);
        console.log(error.details)
        const msg = error.details.map(el => el.message).join('');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!req.user._id.equals(campground.author._id)) {
        req.flash('error', 'you do not have permission to do that')
        return res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error);
        console.log(error.details)
        const msg = error.details.map(el => el.message).join('');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}