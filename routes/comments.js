const express = require('express');
const router = express.Router({mergeParams : true});
const Campground = require('../models/campground');
const middleware = require('../middleware');
const Comments = require('../models/comment');

//comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    //  find campground by id and pass it to render
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
        } else {
            res.render("comment/new", {campground : campground});
        }
    })
});

//comments create
router.post("/", middleware.isLoggedIn,function (req, res) {
    // get the campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            Comments.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                    req.flash('error', 'Something went wrong');
                } else {
                    // add the usename to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save the comment
                    comment.save()
                    campground.comments.push(comment);
                    campground.save();
                    // console.log(comment);
                    req.flash('success', 'successfully added comment')
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            })
        }
    })
    // create a new comment
    // connect the new comment to the campground
    // redirect to the show page
})

//  edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
    Comments.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back")
        } else {
            res.render("comment/edit", { comment : foundComment , campground_id : req.params.id})
        }
    })
});

// update comment
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res) {
    Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment) {
        if (err) {
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// delete
router.delete("/:comment_id",middleware.checkCommentOwner, function (req, res) {
    Comments.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect("back")
        } else {
            req.flash('success', 'Comment Deleted');            
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})


module.exports = router;
