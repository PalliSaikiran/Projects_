const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const listingsSchema  = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { listingsSchema,reviewSchema } = require("../schema.js");
const {validateListing,isLoggedIn,isOwner} = require("../middleware.js")





// index
router.get("/", wrapAsync(async (req, res) => {
    let allListing = await Listing.find()
    res.render("listings/index.ejs", { allListing })
}))


//new
router.get("/new", isLoggedIn,(req, res) => {
    res.render("listings/new.ejs");
})

//create
router.post("/",validateListing,async (req, res) => {
    let { title, description, price, location, country, image } = req.body;
    console.log(title,description,price);
    // if(!req.body){
    //   throw new ExpressError(400,"send  valid data")
    // }
    // let result = listingSchema.validate(req.body); 
    // if (result.error) {
    //   throw new ExpressError(400,result.error)
    // }
    let newListing = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country
    });
    await newListing.save().then((res) => { console.log("saved succesfully"); })
    req.flash("success","New Listing created!!")
    res.redirect("/listings")
})


//show
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    // console.log(id)
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner")
    console.log(listing)
    res.render("listings/show.ejs", { listing })
}))



//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
    // console.log("working");
}))

//update
router.put("/:id", validateListing,isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, price, location, country, image } = req.body;
    
    let listing = await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country
    })
    if(!listing){
        req.flash("error","Listing you requested! Does not exist!")
        res.redirect("/listings")
    }
    req.flash("success","Lisitng Updated!")
    res.redirect(`/listings/${id}`);
}))

//delete
router.delete('/:id',isLoggedIn,isOwner,async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("deleted successfully")
    req.flash("success","Listing Deleted!")
    res.redirect("/listings")   
})

module.exports = router;