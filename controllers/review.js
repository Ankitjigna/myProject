const listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createreview = async (req, res) => {
  let Listing = await listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  Listing.reviews.push(newReview);

  await newReview.save();
  await Listing.save();
  req.flash("success", " New review Created!");
  res.redirect(`/listings/${Listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " review deleted!");

  res.redirect(`/listings/${id}`);
};
