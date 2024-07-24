
const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schema");
const Review = require("../models/review");
const Listing = require("../models/listing");
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js")



// Reviews POST request
router.post("/",isLoggedIn ,validateReview,wrapAsync(async (req, res) => {
  const { id } = req.params;
//   console.log(id);
  const listing = await Listing.findById(id);
//   console.log(listing);
  if (!listing) {
      throw new ExpressError(404, 'Listing not found');
  }
  let newReview = new Review({
      comment: req.body.comment,
      rating: req.body.rating,
  });
  newReview.author = req.user._id
  console.log(newReview)
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","New Review Created!")
  res.redirect(`/listings/${id}`);
}));


// Delete review
router.delete("/:reviewId", isLoggedIn,isAuthor,wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success"," Review Deleted!")
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
