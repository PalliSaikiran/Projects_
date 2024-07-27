const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const { validateListing, isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require('../controllers/listing.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });
const mongoose = require('mongoose');


// Index
router.get("/", wrapAsync(listingController.index));

// Search
router.get('/search',listingController.search );


// New
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create
router.post("/", isLoggedIn, upload.single('image'), validateListing, listingController.createListing);

// Show
router.get("/:id",  wrapAsync(listingController.showListing));

// Edit
router.get("/:id/edit", isLoggedIn,  wrapAsync(listingController.renderEditForm));

// Update
router.put("/:id", isLoggedIn, isOwner, upload.single('image'), validateListing, wrapAsync(listingController.updateListing));

// Delete
router.delete('/:id', isLoggedIn, isOwner, listingController.destroyListing);

module.exports = router;
