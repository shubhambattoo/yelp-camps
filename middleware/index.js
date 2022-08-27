//  all the middlewares
const Campground = require('../models/campground');
const Comments = require('../models/comment');
const middlewareObj = {};

middlewareObj.checkCampgroundOwner = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash('error', 'Campground not found.')
                res.redirect("back");
            } else {
                // does own the campground
                if (foundCampground.author.id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash('error', 'You do not have permission to do that.')                    
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in first');
        res.redirect("back");
    }

    // otherwise redirect
    // if not, redirect
}

middlewareObj.checkCommentOwner = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Comments.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // does own the comment
                if (foundComment.author.id.equals(req.user.id)) {
                    next();
                } else {
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in first');
        res.redirect("back");
    }

    // otherwise redirect
    // if not, redirect
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in first');
    res.redirect("/login")
}

module.exports = middlewareObj;