const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const opts = {toJSON:{ virtuals:true}};

const imageSchema = new Schema({
    url: String,
    filename: String,
});

imageSchema.virtual('thumbnail').get(function(){
    // return this.url
    return this.url.replace('/upload','/upload/w_200')
});

const CampgroundSchema = new Schema({
    title:String,
    image:[imageSchema],
    price:Number,
    description:String,
    geometry:{
        type:{
            type:String,
            enum:['Point']
    },
        coordinates:{
            type:[Number],
            requried:true
        }
    },

    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
},opts);

CampgroundSchema.virtual('properties.popMarkup').get(function(){
    return `<strong><a href="campground/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,30)}...</p>`
})

CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.remove({
            _id:{
                $in: doc.reviews // states that find all the id that are in the doc.reviews, and delete them
            }
        })
    }
})


module.exports =mongoose.model('Campground',CampgroundSchema);
