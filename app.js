const express             = require("express");
const app                 = express();
const bodyParser          = require('body-parser');
const mongoose            = require("mongoose"),
    flash                 = require('connect-flash'),
    passport              = require('passport'),
    LocalStrategy         = require('passport-local'),
    methodOveride         = require('method-override'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User                  = require('./models/user'), 
    Campground            = require('./models/campground'),
    seedDB                = require("./seeds"),
    Comments              = require('./models/comment');

const campgroundRoutes = require('./routes/campgrounds'),
      commentRoutes    = require('./routes/comments'),
      indexRoutes      = require('./routes/index');


mongoose.connect(process.env.DATABASEURL);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + "/public"));

app.use(methodOveride("_method"));
// seedDB(); // seed the database
app.use(flash());

// Passport config
app.use(require('express-session')({ 
    secret: 'manchester united', 
    resave: false, 
    saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 5000, function () {
    console.log("Yelp camp app started on 8080");
})