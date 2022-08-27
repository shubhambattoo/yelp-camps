const mongoose = require("mongoose");
const Campground = require('./models/campground');
const Comments = require('./models/comment');

let data = [
    {
        name : "Clouds Rest",
        image : "https://i.pinimg.com/originals/de/87/6e/de876e226e87a745cebef8a4aed4c940.jpg",
        description : " Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nostrum delectus sint consequuntur laborum eius nam reprehenderit vitae minima deserunt culpa, vero maxime consequatur. Quidem aspernatur minus labore qui aut."
    },
    {
        name : "Chilka Lake",
        image : "https://i.pinimg.com/originals/de/87/6e/de876e226e87a745cebef8a4aed4c940.jpg",
        description : " Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nostrum delectus sint consequuntur laborum eius nam reprehenderit vitae minima deserunt culpa, vero maxime consequatur. Quidem aspernatur minus labore qui aut."
    },
    {
        name : "Lorem ipsum",
        image : "https://images.raquettelake.com/img/boys/campfires_sunset.jpg",
        description : " Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio nostrum delectus sint consequuntur laborum eius nam reprehenderit vitae minima deserunt culpa, vero maxime consequatur. Quidem aspernatur minus labore qui aut."
    }
]
function seedDB () {
    Campground.remove({}, function (err, res) {
        if (err) {
            console.log(err);
        } 
            console.log(" removed camps");
            data.forEach(function (seed) {
                Campground.create(seed, function (err,campground) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Campground added");
                        Comments.create({
                            text: "This is great place loved it",
                            author : "Homer"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err)
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log(`created new comment`)
                            }
                        })
                    }
                })
            });
    });
}

module.exports = seedDB;