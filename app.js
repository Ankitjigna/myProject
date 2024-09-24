const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");

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


app.listen("8080",()=>{
    console.log("app is listening to port : 8080");
});

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

app.get("/",(req,res)=>{
    res.send("home");
})
//showing title

app.get("/listings", async (req,res)=>{
    const allListing = await listing.find({});
    res.render("listings/index.ejs",{allListing});
});


//new route

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});

//showing details

app.get("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    const Listing = await listing.findById(id);
    res.render("listings/show.ejs",{Listing});
});

//create route
 app.post("/listings",async (req,res)=>{
    const newListing =new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
 });


 // edit
app.get("/listings/:id/edit",async (req,res)=>{
    let { id } = req.params;
    const Listing = await listing.findById(id);
    res.render("listings/edit.ejs",{Listing});
});

//update
app.put("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
});

//delete
app.delete("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
})