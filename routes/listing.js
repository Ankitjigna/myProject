const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingContoller = require ("../controllers/listing.js");

//showing title

router.get(
  "/",
  wrapAsync(listingContoller.index
));

//new route

router.get("/new", isLoggedIn, listingContoller.renderNewForm);

//showing details

router.get(
  "/:id",
  wrapAsync(listingContoller.showListings)
);

//create route
router.post(
  "/",
  validateListing,
  isLoggedIn,
  wrapAsync(listingContoller.createListing)
);

// edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingContoller.renderEditForm)
);

//update
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingContoller.updateListing)
);

//delete
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingContoller.destroyListing)
);

module.exports = router;