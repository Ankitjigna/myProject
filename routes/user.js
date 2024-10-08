const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");

const userContoller = require("../controllers/user.js");

router.route("/signup")
.get( userContoller.rendersignupForm)
.post(
  wrapAsync(userContoller.signup)
);


router.route("/login")
.get( userContoller.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userContoller.login
);


router.get("/logout", userContoller.logout);

module.exports = router;
