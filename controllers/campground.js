const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const token = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:token});

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds });
};

module.exports.newCampground = (req, res) => {
    res.render('campground/new')
};

module.exports.createCamground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send()
    // if (!req.body.campground){
    //     throw new ExpressError('Invalid(incomplete data)',400);
    // }  :  basic way of determine if campground is included or not.
    // result.error.detail return an array!!!

    const campground = new Campground(req.body.campground);
    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    campground.geometry = geoData.body.features[0].geometry
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campground/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
        {
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    // console.log(campground);
    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Fail to load this page!');
        res.redirect('/campground');
    }
    res.render('campground/show', { campground });
};


module.exports.editCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campground/edit', { campground });
}


module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.image.push(...img)
    await campground.save();
    if (req.body.deleteimages) {
        for(let filename of req.body.deleteimages){
            cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteimages } } } });
        console.log(campground);
    }
    req.flash('success', 'successfully updated campground')
    res.redirect(`/campground/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    // req.flash('error', 'A Campground has been deleted!')
    req.flash('success', 'successfully delete campground')
    res.redirect('/campground');
}