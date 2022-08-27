const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const Campground = require('../models/campground');

router.get("/", function (req, res) {
    // Get all the campgrounds
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            // name   : data
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds
            });
        }
    });
});

// Create
router.post("/", middleware.isLoggedIn, function (req, res) {
    // get data from form and add new campground
    let name = req.body.name,
        image = req.body.image,
        description = req.body.description,
        price = req.body.price,
        author = {
            id: req.user._id,
            username: req.user.username
        },
        newCampground = {
            name: name,
            image: image,
            price : price,
            description: description,
            author: author
        };
    // console.log(req.user);
    // Create and push to DB
    Campground.create(newCampground, function (err, newCreated) {
        if (err) {
            console.log(err);
        } else {
            // console.log(newCreated);
            req.flash("success", "new campground added");
            // redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    });
})

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

router.get("/:id", function (req, res) {
    // Get the campground with the id and populate the comments
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // render the template
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    })
})

// Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwner, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {
            campground: foundCampground
        });
    });
})
// Update routes
router.put("/:id",middleware.checkCampgroundOwner, function (req, res) {
    // find and update and then
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
    // redirect to the show page
})

// Destroy Routes
router.delete("/:id", middleware.checkCampgroundOwner,function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds");
        }
    })
})


module.exports = router;