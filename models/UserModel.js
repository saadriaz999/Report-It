const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require("mongoose-findorcreate")
const mongoose = require('../models/MongoConnection.js');


// creating user schema
const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    number: String,
    role: String,
    area: String,
    googleId: String
})


// adding plugins to schema
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


// creating collection in MongoDB by connecting schema
const User = mongoose.model('User', userSchema);


module.exports = User
