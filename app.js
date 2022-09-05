if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};


console.log(process.env.API_KEY);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
// const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); // to be able use js in HTML
// const catchsyn = require('./utils/catchAsyn');
const ExpressError = require('./utils/ExpressError');
// const {campgroundSchema,reviewSchema} = require('./utils/validateCampground');
// const Review = require('./models/review');
const campgroundsMethod = require('./routes/campground');
const reviewMethod = require('./routes/review');
const userMethod = require('./routes/user');
const flash = require('connect-flash');
const passport = require('passport');
const Local = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dbUrl =  process.env.DB_URL ||'mongodb://localhost:27017/yelp-camp'

// const {MongoStore} = require('connect-mongo');

const MongoStore = require('connect-mongo');

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});
const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith:'_'
}));

app.use(express.static(path.join(__dirname,'public')));
//this line means, For example, use the following code to serve images, CSS files, and JavaScript files in a directory named public:
const secret = process.env.SECRET || 'Thisshouldbeabettersecret';

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret,
    },
    touchAfter:24*3600,
});

const sessionConfig = {
    store,
    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxage: 1000 * 60 * 60 * 24 * 7
    }
};
//store session in mongo
store.on('error',function(e){
    console.log('session store error')
})


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Local(User.authenticate()));


// app.use(
//     helmet({
//         crossOriginEmbedderPolicy: false,
//         // ...
//     })
// );


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dup0aikyl/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dup0aikyl/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dup0aikyl/"
];
const fontSrcUrls = ["https://res.cloudinary.com/dup0aikyl/"];

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [],
                connectSrc: ["'self'", ...connectSrcUrls],
                scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
                styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                workerSrc: ["'self'", "blob:"],
                objectSrc: [],
                imgSrc: [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://res.cloudinary.com/dup0aikyl/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                    "https://images.unsplash.com/"
                ],
                fontSrc: ["'self'", ...fontSrcUrls],
                mediaSrc: ["https://res.cloudinary.com/dup0aikyl/"],
                childSrc: ["blob:"]
            }
        },
        crossOriginEmbedderPolicy: false
    })
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//how are we going to store a user in a session?
//how are we going to get user out of the session?


app.use((req,res,next)=>{
    // console.log(req.session);
    res.locals.currentUser = req.user;
    //the current loggined
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/campground',campgroundsMethod);
app.use('/campground/:id/reviews',reviewMethod);
app.use('/',userMethod);


// app.get('/makeuser',async(req,res)=>{
//     const user = new User({email:'shijiechen@gmail.com', username: 'Shijie'});
//     const newUser = await User.register(user,'chicken');
//     //register method is from passport-local-mongoose:
//     //a method to register a new user instance with a given passport
//     res.send(newUser);
// })


app.get('/', (req, res) => {
    res.render('home');
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) { err.message = 'something went wrong'; }
    res.status(status).render('error', { err });
})

// app.get('/makecampgournd', async (req, res) => {
//     const camp = new Campground({
//         title: 'My backyard',
//         description: 'cheap camping!'
//     });
//     await camp.save();
//     res.send(camp);
// })

app.listen(9000, () => {
    console.log("serving on 9000");
})