const listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListing = await listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res, next) => {
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
};

module.exports.createListing = async (req, res, next) => {
  // if(!req.body.listing){
  //     throw new ExpressError(400, "send valid data for listing");
  // }
  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;
  const Listing = await listing.findById(id);
  if (!Listing) {
    req.flash("error", "does not exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { Listing });
};

module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", " listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", " listing deleted!");
  res.redirect("/listings");
};
