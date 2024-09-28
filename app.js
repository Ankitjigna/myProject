const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema ,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

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


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


const validateSchema = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400 ,errMsg);
    }else{
        next();
    }
};
//showing title

app.get("/listings", wrapAsync(async (req,res)=>{
    const allListing = await listing.find({});
    res.render("listings/index.ejs",{allListing});
}));


//new route

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});

//showing details

app.get("/listings/:id",wrapAsync(async (req,res,next)=>{
    let { id } = req.params;
    const Listing = await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{Listing});
}));

//create route
 app.post("/listings", validateListing ,wrapAsync(async (req,res,next)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400, "send valid data for listing");
    // }
    const newListing =new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
 }));


 // edit
app.get("/listings/:id/edit",wrapAsync(async (req,res ,next)=>{
    let { id } = req.params;
    const Listing = await listing.findById(id);
    res.render("listings/edit.ejs",{Listing});
}));

//update
app.put("/listings/:id", validateListing, wrapAsync(async (req,res ,next)=>{
    let { id } = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

//delete
app.delete("/listings/:id",wrapAsync(async (req,res,next)=>{
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// review ---post 
app.post("/listings/:id/reviews",validateSchema, wrapAsync(async(req,res)=>{
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    Listing.reviews.push(newReview);

    await newReview.save();
    await Listing.save();
    // console.log("new review saved");
    // res.send("new review saved");

    res.redirect(`/listings/${Listing._id}`);
}));


// review delete

app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id ,reviewId} = req.params;

    await listing.findByIdAndUpdate(id ,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));


// app.get("/testlisting",async (req,res)=>{
//     let sample = new listing({
//         title:"new home",
//         description:"near the DLF mall",
//         price:12000,
//         location:"noida",
//         country:"India",
//     });
//     await sample.save();
//     console.log("saved");
//     res.send("testing success");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "page not found!"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong!"} = err;
    res.render("listings/error.ejs" ,{message});
    // res.status(status).send(message);
});

app.listen("8080",()=>{
    console.log("app is listening to port : 8080");
});

