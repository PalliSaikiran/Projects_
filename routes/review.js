
const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schema");
const Review = require("../models/review");
const Listing = require("../models/listing");
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js");
const reviewController  = require('../controllers/review.js');



// Reviews POST request
router.post("/",isLoggedIn ,wrapAsync(reviewController.createReview));


// Delete review
router.delete("/:reviewId", isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;
