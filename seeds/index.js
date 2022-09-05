const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

const sample = (array)=> array[Math.floor(Math.random()*array.length)];


const seedDB = async ()=>{
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20);
        const camp = new Campground({
            author: "630a7f4c275261355ece44fc",
            //your author or user id
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit non ipsum quod assumenda! Odit dolor aliquid esse, optio sequi sunt totam commodi enim cumque dolorem officiis magni veniam suscipit reiciendis!',
            price,
            image: [
                {
                    url: 'https://res.cloudinary.com/dup0aikyl/image/upload/v1661815369/Yelpcamp/kdxpfph6oiaxg5nnagr0.jpg',
                    filename: 'Yelpcamp/kdxpfph6oiaxg5nnagr0',
                    
                },
                {
                    url: 'https://res.cloudinary.com/dup0aikyl/image/upload/v1661815377/Yelpcamp/sld6e1zp4tqi0x2epapq.jpg',
                    filename: 'Yelpcamp/sld6e1zp4tqi0x2epapq',
                }
            ],
            geometry:{
                type:'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            }
        })
        await camp.save();
    }
}

seedDB();