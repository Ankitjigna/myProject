const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");

const userContoller = require("../controllers/user.js");

router.get("/signup", userContoller.rendersignupForm);

router.post(
  "/signup",
  wrapAsync(userContoller.signup)
);

router.get("/login", userContoller.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userContoller.login
);

router.get("/logout", userContoller.logout);

module.exports = router;
