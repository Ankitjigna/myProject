const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport")
const LocalStrategy = require("passport-local");
const User = require('./models/user.js');


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate);

app.use(express.static(path.join(__dirname,"/public")));

// mongoose

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/duniya');
}
main()
.then((res)=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    Cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 4,
        maxAge:  1000 * 60 * 60 * 24 * 4,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/demouser",async(req,res)=>{
    let fakeUser = new User({
        email: "abc@gamil.com",
        username: "abc",
    });

    let registeredUser = await User.register(fakeUser,"abc@1234");
    res.send(registeredUser);
});

app.get("/",(req,res)=>{
    res.send("home");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "page not found!"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong!"} = err;
    res.render("listings/error.ejs" ,{message});
});

app.listen("8080",()=>{
    console.log("app is listening to port : 8080");
});

