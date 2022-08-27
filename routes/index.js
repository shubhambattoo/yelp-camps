const express = require('express');
const router = express.Router();
const User = require('../models/user');
const middleware = require('../middleware');
const passport = require('passport');

// roote route
router.get("/", function (req, res) {
    res.render("landing");
})


// show register page
router.get("/register", function(req, res) {
    res.render("register")
})
// process the sign up
router.post("/register", function (req, res) {
    let newUser = new User({username : req.body.username});

    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            // console.log(err);
            return res.redirect('register');
        }
        passport.authenticate('local')(req, res, function () {
            req.flash("success", "Welcome to YelpCamp"  + user.username);            
            res.redirect("/campgrounds")
        })
    })
});

// show login form
router.get("/login", function(req, res) {
    res.render("login")
});
// middleware
let login = passport.authenticate('local', {
    successRedirect : '/campgrounds',
    failureRedirect : '/login'
})
// handling login process
router.post("/login", login, function(req, res) {
})

// logout 
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Successfuly logged you out!");
    res.redirect("/campgrounds");
})


module.exports = router;
