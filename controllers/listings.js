const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

module.exports.createNewListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url ,"..", filename);

    // let result = listingSchema.validate(req.body);
    // if (result.error) {
    //     throw new ExpressError(400, result.error);
    // }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.showListings = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you are requesting for do not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
};

module.exports.editRoute = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are requesting for do not exists!");
        return res.redirect("/listings");
    }
    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace("/upload","/upload/w_250");
    res.render("listings/edit", { listing, originalImageURL});
};

module.exports.updateRoute = async (req, res, next) => {
    // console.log(req.body);
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    if (!listing) {
        req.flash("error", "Listing you are requesting for do not exists!");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing Updated!");
    res.redirect("/listings");
};

module.exports.deleteRoute = async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    if (!deletedListing) {
        req.flash("error", "Listing you are requesting for do not exists!");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};