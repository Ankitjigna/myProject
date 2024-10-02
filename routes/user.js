const express = require("express");
const router = express.Router();
const user =require("../models/user.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
});

router.post("/signup", async(req,res)=>{
   try {
    let {username,email,password} = req.body;
    const newUser = new user ({username,email});
    let registeredUser = await user.register(newUser,"abc@1234");
    console.log(registeredUser);
    req.flash("success", "welcome to duniya!");
    res.redirect("/listings");
   } catch (e) {
    req.flash("error",e.message);
    res.redirect("/signup");
   }
})

module.exports = router;