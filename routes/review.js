const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { validateReview } = require("../middleware.js");

const reviewController = require("../controllers/review.js");
// review ---post
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createreview)
);

// review delete

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
