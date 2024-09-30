const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {listingSchema ,reviewSchema} = require("../schema.js");
const listing = require("../models/listing.js");

const validateSchema = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400 ,errMsg);
    }else{
        next();
    }
};


// review ---post 
router.post("/",validateSchema, wrapAsync(async(req,res)=>{
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    Listing.reviews.push(newReview);

    await newReview.save();
    await Listing.save();
    req.flash("success" ," New review Created!")

    res.redirect(`/listings/${Listing._id}`);
}));


// review delete

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id ,reviewId} = req.params;

    await listing.findByIdAndUpdate(id ,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" ," review deleted!")

    res.redirect(`/listings/${id}`);
}));

module.exports=router;