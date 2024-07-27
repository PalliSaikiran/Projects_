const Listing = require("../models/listing")
const ExpressError = require("../utils/ExpressError");

// Escape special characters for regex
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports.index = async (req, res) => {
    let allListing = await Listing.find()
    res.render("listings/index.ejs", { allListing })
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.search = async (req, res) => {
    const { query } = req.query;
    let listings = [];

    if (query) {
        const regex = new RegExp(escapeRegex(query), 'gi');
        listings = await Listing.find({
            $or: [
                { title: regex },
                { description: regex },
                { location: regex },
                { country: regex }
            ]
        });
    }

    res.render('listings/search', { listings });
}

module.exports.createListing= async (req, res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,filename)
    let { title, description, price, location, country, image } = req.body;
    // console.log(title,description,price);
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
        image: {
            url:url,
            filename:filename
        },
        price: price,
        location: location,
        country: country,
        owner: req.user._id 
    });
    await newListing.save().then((res) => { console.log("saved succesfully"); })
    req.flash("success","New Listing created!!")
    res.redirect("/listings")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    // console.log(id)
    const listing = await Listing.findById(id).populate({ path: 'owner' }).populate({ path: 'reviews', populate: { path: 'author' } });
    console.log(listing)
    res.render("listings/show.ejs", { listing })
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
    // console.log("working");
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body;

    let listingData = {
        title: title,
        description: description,
        price: price,
        location: location,
        country: country
    };

    if (req.file) {
        listingData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    let listing = await Listing.findByIdAndUpdate(id, listingData, { new: true });

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("deleted successfully")
    req.flash("success","Listing Deleted!")
    res.redirect("/listings")   
}