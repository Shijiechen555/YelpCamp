const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.postReview =async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    // console.log(review)
    await review.save();
    await campground.save();
    // console.log(campground);
    req.flash('success', 'You posted a review !')
    res.redirect(`/campground/${campground._id}`)
};

module.exports.deleteReview =async (req, res) => {
    const { id, reid } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reid } });
    // !!!!!!!!!!!!!!!!!!
    await Review.findByIdAndDelete(reid);
    req.flash('success', 'Review has been successfully deleted !')
    res.redirect(`/campground/${id}`);
}