const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema ,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

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


app.get("/",(req,res)=>{
    res.send("home");
})


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

