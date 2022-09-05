const mongoose = require('mongoose');
const passportlocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(passportlocalMongoose);
//more convient to add uername and password but you can't learn anything from it!

module.exports = mongoose.model('User', UserSchema);