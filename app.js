const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js")



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

app.get("/testlisting",async (req,res)=>{
    let sample = new listing({
        title:"new home",
        description:"near the DLF mall",
        price:12000,
        location:"noida",
        country:"India",
    });
    await sample.save();
    console.log("saved");
    res.send("testing success");
});

app.get("/",(req,res)=>{
    res.send("home");
})