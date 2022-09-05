const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
};

module.exports.registerUser =async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeruser = await User.register(user, password);
        req.login(registeruser, err => {
            if (err) return next(err);
            res.
                req.flash('success', 'Welcome to yelpcamps')
            res.redirect('/campground');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/campground');
    }
};

module.exports.loginForm = (req, res) => {
    res.render('users/login')
};


module.exports.loginUser = async (req, res) => {
    //middlewera from passport
    req.flash('success', 'Welcome back!');
    // console.log(req.session);
    const page = req.session.returnto || '/campground';
    res.redirect(page);
};

module.exports.logoutUser = (req, res) => {
    req.logout();
    res.redirect('/campground');
    //the following code works for passport 6.0 which is a newer version
    // req.logout(function (err) {
    //     if (err) { return next(err); }
    //     req.flash('success','Logged out');
    // res.redirect('/campground');
    // });
};



