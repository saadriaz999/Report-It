require("ejs")
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userRoutes = require('./routes/UserRouter');
const complaintRoutes = require('./routes/ComplaintRouter');
const imageRoutes = require('./routes/ImageRouter');
const videoRoutes = require('./routes/VideoRouter')
const audioRoutes = require('./routes/AudioRouter');
const User = require('./models/UserModel');
const userController = require("./controllers/UserController");
const adminUtils = require("./utils/AdminUtils");


// make the app object
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());


// making the session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))


// integrating passport js with the express app
app.use(passport.initialize());
app.use(passport.session())


// creating the User login strategy
passport.use(User.createStrategy());


// serialize and deserialize user objects
passport.serializeUser(function(user, done) {
    done(null,user.id);
})
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    })
})


// creating a login strategy for google authentication
passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:9000/user/auth/google/redirect",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            if (err) {
                console.log(err);
            } else {
                return cb(err, user);
            }
        });
    }
));


// adding route to home page
app.get('/', (req, res)=>{res.status(200).render("home.ejs")});

// connecting routers
app.use('/user', userRoutes);
app.use('/complaint', complaintRoutes);
app.use('/image', imageRoutes);
app.use('/video', videoRoutes);
app.use('/audio', audioRoutes);


// create admin user
adminUtils.createAdmin();


// start app
const port = 9000;
app.listen(port, function() {
    console.log("Server is running on port " + port);
})
