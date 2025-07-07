const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))                                                //index route
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createNewListing));      //create route


//create route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListings))                                         //show route 
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateRoute))    //update route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));                 //delete route

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editRoute));

module.exports = router;