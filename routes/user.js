const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync (async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new user({ username, email });
    let registeredUser = await user.register(newUser, "abc@1234");
    console.log(registeredUser);
    req.flash("success", "welcome to duniya!");
    res.redirect("/listings");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    res.send("welcome u are logged in!");
  }
);

module.exports = router;
