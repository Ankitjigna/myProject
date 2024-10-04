const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema ,reviewSchema} = require("../schema.js");
const listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");



const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


//showing title

router.get("/", wrapAsync(async (req,res)=>{
    const allListing = await listing.find({});
    res.render("listings/index.ejs",{allListing});
}));


//new route

router.get("/new", isLoggedIn ,(req,res)=>{
    res.render("listings/new.ejs")
});

//showing details

router.get("/:id",wrapAsync(async (req,res,next)=>{
    let { id } = req.params;
    const Listing = await listing.findById(id).populate("reviews").populate("owner");
    if(!Listing){
        req.flash("error","does not exist");
        res.redirect("/listings");
    }
    console.log(Listing);
    res.render("listings/show.ejs",{Listing});
}));

//create route
router.post("/", validateListing ,isLoggedIn,wrapAsync(async (req,res,next)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400, "send valid data for listing");
    // }
    const newListing =new listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success" ,"New listing Created!");
    res.redirect("/listings");
 }));


 // edit
 router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res ,next)=>{
    let { id } = req.params;
    const Listing = await listing.findById(id);
    if(!Listing){
        req.flash("error","does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{Listing});
}));

//update
router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req,res ,next)=>{
    let { id } = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success" ," listing updated!");
    res.redirect("/listings");
}));

//delete
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res,next)=>{
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success" ," listing deleted!");
    res.redirect("/listings");
}));

module.exports=router;