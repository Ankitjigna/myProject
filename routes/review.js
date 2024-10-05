const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {listingSchema ,reviewSchema} = require("../schema.js");
const listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const { validateReview } = require("../middleware.js");
// review ---post 
router.post("/",isLoggedIn,validateReview, wrapAsync(async(req,res)=>{
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    Listing.reviews.push(newReview);

    await newReview.save();
    await Listing.save();
    req.flash("success" ," New review Created!")

    res.redirect(`/listings/${Listing._id}`);
}));


// review delete

router.delete("/:reviewId",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id ,reviewId} = req.params;

    await listing.findByIdAndUpdate(id ,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" ," review deleted!")

    res.redirect(`/listings/${id}`);
}));

module.exports=router;