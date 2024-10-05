const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//showing title

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await listing.find({});
    res.render("listings/index.ejs", { allListing });
  })
);

//new route

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//showing details

router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const Listing = await listing
      .findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!Listing) {
      req.flash("error", "does not exist");
      res.redirect("/listings");
    }
    console.log(Listing);
    res.render("listings/show.ejs", { Listing });
  })
);

//create route
router.post(
  "/",
  validateListing,
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400, "send valid data for listing");
    // }
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing Created!");
    res.redirect("/listings");
  })
);

// edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing) {
      req.flash("error", "does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { Listing });
  })
);

//update
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", " listing updated!");
    res.redirect(`/listings/${id}`);
  })
);

//delete
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", " listing deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
