const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingContoller = require ("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});

router.route( "/")
.get(
  wrapAsync(listingContoller.index
))
.post(
  isLoggedIn,
  
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingContoller.createListing)
);


//new route
router.get("/new", isLoggedIn, listingContoller.renderNewForm);

router.route("/:id")
.get(
  wrapAsync(listingContoller.showListings)
)
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingContoller.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingContoller.destroyListing)
);

// edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingContoller.renderEditForm)
);

module.exports = router;