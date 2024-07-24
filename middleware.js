const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingsSchema,reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing!")
        res.redirect("/login")
    }
    next();
};

module.exports.saveRedirecturl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    console.log("Checking ownership for listing:", id);
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have access to edit.");
        console.log("User does not have access to edit this listing.");
        return res.redirect(`/listings/${id}`);
    }
    console.log("User is the owner of the listing.");
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    let { reviewId,id } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect("/listings");
    }
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have access");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    // Log the listings schema and request body for debugging
    console.log("Listings Schema:", listingsSchema.describe()); // Log schema details for debugging
    console.log("Request Body:", req.body);

    // Validate the request body against the listings schema
    const { error } = listingsSchema.validate(req.body);

    if (error) {
        // If there is a validation error, pass it to the error handler middleware
        return next(new ExpressError(400, error.details[0].message)); // Providing specific error message
    } else {
        // If validation succeeds, move to the next middleware
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(', '));
    } else {
        next();
    }
};